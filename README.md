td ; command line todo-list tools for engineers
==================================================
## Features
1. add(추가), ls(조회), rm(삭제), fin(끝내기) 기능 지원 
2. 일정 공유를 위한 채널 생성 기능 (mkch, pubch)
3. 채널 구독을 통한 일정 받아 보기 (subch -> ls) ; api 서버 실행 후 이용 가능
4. 웹 페이지 에서의 데이터 시각화 및 업무 패턴 분석 (계획)

## Installation
1. git clone 
2. cd td
3. npm install
2. 'cmd' 디렉터리 path를 .bashrc에 추가합니다.
	<pre>export PATH=$PATH:/home/jeinsong/td/cmd:</pre>

## Usage
> ## td -h 
>> 지원하는 명령어를 확인할 수 있습니다.
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

> ## td help 'command'
>> 특정 명령어의 사용법을 확인합니다.
<pre>
  Usage: td-add [options]

  Options:

    -t, --todo <required>  Todo
    -s, --secret           Secret mode
    -h, --help             output usage information
</pre>

> ## td add -t "첫번째 일정"
<pre>
add command ;  + 첫번째 일정
- Public mode -
Added Successfully
</pre>

> ## td ls 
<pre>
ls command
0.  sub todo item 추가 옵션
1.  계획 추가 기능
2.  삭제기능 추가하기
3.  바로 끝내는 명령어 넣을까
4.  서버 file io
5.  첫번째 일정
</pre>


- 제가 써보니 매우 편리하고 효율적인 업무 관리를 가능하게하는 툴임이 분명합니다
- 커맨드라인 상에서 작업하는 시간이 많은 분일 수록 꼭 써야합니다
- 안쓰면 바보
