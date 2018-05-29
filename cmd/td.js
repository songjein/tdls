#!/usr/bin/env node
/**
 * TODO: 콘솔 접속하자마자 todolist 보여주기 
 * TODO:
 */

const program  = require('commander');
const chalk = require('chalk');

program
	.version('0.0.1')
	.command('add', 'add todo item').alias('a')
	.command('list', 'list todo items').alias('l')
	.parse(process.argv)

if (program.args.length === 0) program.help();


/**
 *	API 서버 정보
 */
SERVER_ADDR = "localhost:48484"
ADD = "/add"
LS = "/ls"
RM = "/rm"
FIN = "/fin"
MKCH = "/mkch"
SUBCH = "/subch"
PUBCH = "/pubch"

/**
 *	기타 전역 변수
 */
const log = console.log;

/**
 *	function 정의
 */

/**
 *	add todo
 */
function add(argv) {
	log("add");
}


/**
 *	list todo	
 */
function ls(argv) {
	log("ls");
}


/**
 *	remove todo	
 */
function rm(argv) {
	log("rm");
}


/**
 *	finish todo	
 */
function fin(argv) {
	log("fin");
}


/**
 *	subscribe channel
 */
function mkch(argv) {
	log("mkch");
}


/**
 *	subscribe channel
 */
function subch(argv) {
	log("subch");
}


/**
 *	publish item to channel
 */
function subch(argv) {
	log("pubch");
}

