/* ========== MODULES ========== */

const chalk  = require('chalk');
const dotenv = require('dotenv');
const fs     = require('fs');

/* ========== CONFIG ========== */

const DUMP_DIR = 'database_dump';

const ENV_DEV  = '.env.development';
const ENV_PROD = '.env.production';
const ENV_TEST = '.env.test';

/* ========== HELPERS ========== */

const COLORS = {
  'TITLE'       : chalk.white.bold,
  'ERROR'       : chalk.redBright.bold,
  'DESTRUCTIVE' : chalk.red,   // a command that changes destructively
  'NEUTRAL'     : chalk.white, // a command that does not change anything
  'SAFE'        : chalk.green, // a command that changes nondestructively
};

function repeat (character, count) {
  return character.repeat(count);
}

function error (text) {
  const message = "ERROR: " + text + "\n";
  const color   = COLORS.ERROR;

  console.error(color(message));
}

function header (text) {
  const message = "\n" + repeat('=', 10) + " " + text + " " + repeat('=', 10) + "\n";
  const color   = COLORS.TITLE;

  console.log(color(message));
}

function subheader (text) {
  const message = text + "\n";
  const color   = COLORS.TITLE;

  console.log(color(message));
}

function title (text) {
  const message = repeat(" ", 4) + text + "\n";
  const color   = COLORS.TITLE;

  console.log(color(message));
}

function command (text, color = COLORS.NEUTRAL) {
  const message = repeat(" ", 8) + text + "\n";
  console.log(color(message));
}

function destructiveCommand (text) {
  command(text, COLORS.DESTRUCTIVE);
}

function safeCommand (text) {
  command(text, COLORS.SAFE);
}

/* ========== LOGIC ========== */

if (!fs.existsSync(ENV_DEV) || !fs.existsSync(ENV_PROD) || !fs.existsSync(ENV_TEST)) {
  error('env files not found');
  process.exit(1);
}

const DEV  = dotenv.parse(fs.readFileSync(ENV_DEV));
const PROD = dotenv.parse(fs.readFileSync(ENV_PROD));
const TEST = dotenv.parse(fs.readFileSync(ENV_TEST));

header('USEFUL MONGO COMMANDS');

subheader('[development]');

title('TO CONNECT TO THE development DATABASE USING THE mongo SHELL');
command(`mongo ${DEV.DB_HOST}:${DEV.DB_PORT}/${DEV.DB_NAME} -u ${DEV.DB_USER} -p ${DEV.DB_PASS}`)

title('TO CONNECT TO THE development DATABASE USING THE MongoDB URI');
command(`mongodb://${DEV.DB_USER}:${DEV.DB_PASS}@${DEV.DB_HOST}:${DEV.DB_PORT}/${DEV.DB_NAME}`);

title('TO DUMP development DATABASE');
command(`mongodump -h ${DEV.DB_HOST}:${DEV.DB_PORT} -d ${DEV.DB_NAME} -u ${DEV.DB_USER} -p ${DEV.DB_PASS} -o ${DUMP_DIR}`);

title('TO IMPORT DATABASE DUMP TO development DATABASE (does not overwrite)');
safeCommand(`mongorestore -h ${DEV.DB_HOST}:${DEV.DB_PORT} -d ${DEV.DB_NAME} -u ${DEV.DB_USER} -p ${DEV.DB_PASS} ${DUMP_DIR}/*`);

title('TO CONVERT development DATABASE DUMP bson FILES TO json');
command(`for bson in ${DUMP_DIR}/${DEV.DB_NAME}/*.bson ; do bsondump --outFile $(echo $bson | sed -e "s/bson$/json/") $bson ; done`);

subheader('[production]');

title('TO CONNECT TO THE production DATABASE USING THE mongo SHELL');
command(`mongo ${PROD.DB_HOST}:${PROD.DB_PORT}/${PROD.DB_NAME} -u ${PROD.DB_USER} -p ${PROD.DB_PASS}`)

title('TO CONNECT TO THE production DATABASE USING THE MongoDB URI');
command(`mongodb://${PROD.DB_USER}:${PROD.DB_PASS}@${PROD.DB_HOST}:${PROD.DB_PORT}/${PROD.DB_NAME}`);

title('TO DUMP production DATABASE');
command(`mongodump -h ${PROD.DB_HOST}:${PROD.DB_PORT} -d ${PROD.DB_NAME} -u ${PROD.DB_USER} -p ${PROD.DB_PASS} -o ${DUMP_DIR}`);

title('TO CONVERT production DATABASE DUMP bson FILES TO json');
command(`for bson in ${DUMP_DIR}/${PROD.DB_NAME}/*.bson ; do bsondump --outFile $(echo $bson | sed -e "s/bson$/json/") $bson ; done`);

// subheader('[test]');

// title('TO CONNECT TO THE test DATABASE USING THE mongo SHELL');
// command(`mongo ${TEST.DB_HOST}:${TEST.DB_PORT}/${TEST.DB_NAME} -u ${TEST.DB_USER} -p ${TEST.DB_PASS}`)

// title('TO CONNECT TO THE test DATABASE USING THE MongoDB URI');
// command(`mongodb://${TEST.DB_USER}:${TEST.DB_PASS}@${TEST.DB_HOST}:${TEST.DB_PORT}/${TEST.DB_NAME}`);

// title('TO DUMP test DATABASE');
// command(`mongodump -h ${TEST.DB_HOST}:${TEST.DB_PORT} -d ${TEST.DB_NAME} -u ${TEST.DB_USER} -p ${TEST.DB_PASS} -o ${DUMP_DIR}`);

// title('TO IMPORT DATABASE DUMP TO test DATABASE (does not overwrite)');
// safeCommand(`mongorestore -h ${TEST.DB_HOST}:${TEST.DB_PORT} -d ${TEST.DB_NAME} -u ${TEST.DB_USER} -p ${TEST.DB_PASS} ${DUMP_DIR}/*`);

// title('TO CONVERT test DATABASE DUMP bson FILES TO json');
// command(`for bson in ${DUMP_DIR}/${TEST.DB_NAME}/*.bson ; do bsondump --outFile $(echo $bson | sed -e "s/bson$/json/") $bson ; done`);

subheader('[ALL]');

title('TO DELETE DATABASE DUMPS');
destructiveCommand(`rm -rf ${DUMP_DIR}`);
