/**
 * Gera as credenciais do painel do admin.
 *
 * Rodar:
 *   sudo node admin/senha.mjs --escrever /etc/sevensport-admin.env    grava direto
 *   npm run admin:senha                                   imprime para você colar
 *
 * PREFIRA `--escrever`. Copiar e colar um hash de 150 caracteres por terminal e
 * editor é frágil: já aconteceu de os NOMES das variáveis chegarem ao arquivo e
 * os valores não, deixando `ADMIN_SENHA_HASH=` vazio — três linhas, tudo com
 * cara de certo, e o serviço em laço de restart reclamando de credencial.
 *
 * A senha em claro nunca é gravada em lugar nenhum: o que sai daqui é o hash
 * scrypt, que não dá para voltar atrás. E a senha é lida escondida, sem eco, para
 * não ir parar no histórico do shell — que é o que aconteceria com um argumento.
 */
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';
import { writeFileSync, chmodSync, existsSync } from 'node:fs';
import { stdin, stdout } from 'node:process';

/** Custo do scrypt. 128 * N * r = 32 MB por tentativa — cara o bastante para força bruta. */
export const CUSTO = { N: 32768, r: 8, p: 1, keylen: 64, maxmem: 64 * 1024 * 1024 };

export function gerarHash(senha) {
  const sal = randomBytes(16);
  const derivada = scryptSync(senha.normalize('NFKC'), sal, CUSTO.keylen, CUSTO);
  return `scrypt$${CUSTO.N}$${CUSTO.r}$${CUSTO.p}$${sal.toString('base64')}$${derivada.toString('base64')}`;
}

/**
 * Uma pergunta no terminal, com ou sem eco.
 *
 * ⚠ Recebe a interface de readline pronta e NÃO a fecha. Abrir uma por pergunta
 * parece mais limpo e não funciona: depois que a primeira é fechada, a seguinte
 * nasce muda no mesmo TTY — o texto do prompt não aparece e a resposta volta
 * vazia, sem erro nenhum. Uma interface para a sessão inteira, fechada no fim.
 */
export function perguntar(rl, rotulo, escondido = false) {
  return new Promise((resolve, reject) => {
    const escrever = stdout.write.bind(stdout);
    let engolindo = escondido;
    if (escondido) {
      stdout.write = (pedaco, ...resto) => (engolindo ? true : escrever(pedaco, ...resto));
    }
    escrever(rotulo);
    rl.question('', (resposta) => {
      if (escondido) {
        engolindo = false;
        stdout.write = escrever;
        escrever('\n');
      }
      resolve(resposta);
    });
    rl.on('error', reject);
  });
}

/** `--escrever <caminho>`; o primeiro argumento solto vira o nome de usuário. */
function lerArgumentos(argv) {
  const opcoes = { usuario: 'admin', escrever: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--escrever') opcoes.escrever = argv[++i];
    else if (!argv[i].startsWith('-')) opcoes.usuario = argv[i];
  }
  return opcoes;
}

// Só roda o passo a passo quando chamado direto; o servidor importa `gerarHash`.
if (import.meta.filename === process.argv[1]) {
  if (!stdin.isTTY) {
    console.error('Rode num terminal de verdade: a senha é digitada escondida.');
    process.exit(1);
  }

  const { usuario, escrever } = lerArgumentos(process.argv.slice(2));

  if (escrever === undefined || escrever === '') {
    console.error('Faltou o caminho depois de --escrever.');
    process.exit(1);
  }

  const rl = createInterface({ input: stdin, output: stdout, terminal: true });

  // A confirmação vem ANTES da senha: não faz sentido digitar duas vezes para
  // só então descobrir que nada seria escrito.
  if (escrever && existsSync(escrever)) {
    const resposta = await perguntar(rl, `${escrever} já existe. Sobrescrever? (s/N) `);
    if (resposta.trim().toLowerCase() !== 's') {
      console.error('Nada foi escrito.');
      process.exit(1);
    }
  }

  const senha = await perguntar(rl, `Senha para o usuário "${usuario}": `, true);
  const confirmacao = await perguntar(rl, 'Repita a senha: ', true);
  rl.close();

  if (senha !== confirmacao) {
    console.error('\nAs duas senhas não batem. Nada foi gerado.');
    process.exit(1);
  }
  if (senha.length < 10) {
    console.error('\nUse pelo menos 10 caracteres. Este painel fica exposto na internet.');
    process.exit(1);
  }

  const conteudo =
    `ADMIN_USUARIO=${usuario}\n` +
    `ADMIN_SENHA_HASH=${gerarHash(senha)}\n` +
    `ADMIN_SEGREDO=${randomBytes(32).toString('base64')}\n`;

  if (!escrever) {
    console.log(`
Cole as TRÊS linhas em admin/.env.local (local) ou /etc/sevensport-admin.env (VPS).
Cada uma é UMA linha só — se o editor cortar ou quebrar o hash, não funciona.
O arquivo NÃO pode ir para o git — o .gitignore já cobre admin/.env.local.

${conteudo}
ADMIN_SEGREDO assina o cookie de sessão. Trocar esse valor derruba todo mundo
que estiver logado — é assim que se expulsa uma sessão perdida.

Na VPS, evite o copia-e-cola:
  sudo node admin/senha.mjs --escrever /etc/sevensport-admin.env
`);
    process.exit(0);
  }

  // O modo do writeFileSync só vale para arquivo NOVO; num que já existia, o
  // modo antigo permanece. O chmod depois é o que garante 600 nos dois casos.
  writeFileSync(escrever, conteudo, { mode: 0o600 });
  chmodSync(escrever, 0o600);

  console.log(`
Gravado em ${escrever}, modo 600, numa linha por variável.
Nada foi impresso na tela: o hash e o segredo só existem dentro do arquivo.

Usuário: ${usuario}

Agora:
  sudo systemctl restart sevensport-admin
  sudo journalctl -u sevensport-admin -n 15 --no-pager
`);
}
