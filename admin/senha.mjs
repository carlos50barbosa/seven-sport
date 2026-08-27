/**
 * Gera as credenciais do painel do admin.
 *
 * Rodar:  npm run admin:senha
 *
 * Imprime um bloco pronto para colar em `admin/.env.local` (na sua máquina) ou
 * em `/etc/sevensport-admin.env` (na VPS). A senha em claro nunca é gravada em
 * lugar nenhum: o que sai daqui é o hash scrypt, que não dá para voltar atrás.
 *
 * A senha é lida escondida, sem eco no terminal, e por isso NÃO vai para o
 * histórico do shell — que é o que aconteceria com `admin/senha.mjs "senha"`.
 */
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

/** Custo do scrypt. 128 * N * r = 32 MB por tentativa — cara o bastante para força bruta. */
export const CUSTO = { N: 32768, r: 8, p: 1, keylen: 64, maxmem: 64 * 1024 * 1024 };

export function gerarHash(senha) {
  const sal = randomBytes(16);
  const derivada = scryptSync(senha.normalize('NFKC'), sal, CUSTO.keylen, CUSTO);
  return `scrypt$${CUSTO.N}$${CUSTO.r}$${CUSTO.p}$${sal.toString('base64')}$${derivada.toString('base64')}`;
}

/** Lê sem eco. O readline normal devolveria a senha na tela e no scrollback. */
function perguntarEscondido(rotulo) {
  return new Promise((resolve, reject) => {
    const rl = createInterface({ input: stdin, output: stdout, terminal: true });
    const escrever = stdout.write.bind(stdout);
    let engolindo = true;
    stdout.write = (pedaco, ...resto) => (engolindo ? true : escrever(pedaco, ...resto));
    escrever(rotulo);
    rl.question('', (resposta) => {
      engolindo = false;
      stdout.write = escrever;
      escrever('\n');
      rl.close();
      resolve(resposta);
    });
    rl.on('error', reject);
  });
}

// Só roda o passo a passo quando chamado direto; o servidor importa `gerarHash`.
if (import.meta.filename === process.argv[1]) {
  if (!stdin.isTTY) {
    console.error('Rode num terminal de verdade: a senha é digitada escondida.');
    process.exit(1);
  }

  const usuario = process.argv[2] ?? 'admin';
  const senha = await perguntarEscondido(`Senha para o usuário "${usuario}": `);
  const confirmacao = await perguntarEscondido('Repita a senha: ');

  if (senha !== confirmacao) {
    console.error('\nAs duas senhas não batem. Nada foi gerado.');
    process.exit(1);
  }
  if (senha.length < 10) {
    console.error('\nUse pelo menos 10 caracteres. Este painel fica exposto na internet.');
    process.exit(1);
  }

  console.log(`
Cole isto em admin/.env.local (local) ou /etc/sevensport-admin.env (VPS).
O arquivo NÃO pode ir para o git — o .gitignore já cobre admin/.env.local.

ADMIN_USUARIO=${usuario}
ADMIN_SENHA_HASH=${gerarHash(senha)}
ADMIN_SEGREDO=${randomBytes(32).toString('base64')}

ADMIN_SEGREDO assina o cookie de sessão. Trocar esse valor derruba todo mundo
que estiver logado — é assim que se expulsa uma sessão perdida.
`);
}
