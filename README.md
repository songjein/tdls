td ; command line todo-list tools for engineers
==================================================
## Features
1. add, ls, rm, fin todo items
2. Making channels 
3. Sharing todo items by subscribing channels
4. Data visualization 
4. Interrupting program development (찬란바보)

## Installation
1. git clone
2. npm install
2. add location of 'cmd' directory to .bashrc
	<pre>export PATH=$PATH:/home/jeinsong/td/cmd:</pre>

## Usage
1.td -h
<pre>

  Usage: td [options] [command]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    add|a          add todo item
    ls|l           list todo items
    lsf|lf         list finished todo items
    co|c           change order of two items
    fin|f          finish todo item
    rm|r           remove todo item
    mkch|mc        make channel
    lsch|lc        list subscribed channels
    rmch|rc        remove subscribed channel
    subch|sc       subscribe channel
    pubch|pc       publish todo item
    help [cmd]     display help for [cmd]

</pre>
- 제가 써보니 매우 편리하고 효율적인 업무 관리를 가능하게하는 툴임이 분명합니다
- 커맨드라인 상에서 작업하는 시간이 많은 분일 수록 꼭 써야합니다
- 안쓰면 바보
