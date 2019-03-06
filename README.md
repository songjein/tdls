# td-ls; https://tdls.dev
Simple, Lightweight, Command-line Todo-list & Tech-blogging Service for Engineers.  
콘솔 인터페이스 상에서 투두리스트, 메모 작성 및 마크다운 파일을 이용한 블로깅이 가능합니다.

## Contribution
- tdls는 주로 다음과 같은 라이브러리를 이용해 개발되었습니다. 아이디어가 있으시면 개발에 참여해주세요!
  - [commander.js](https://github.com/tj/commander.js/), [inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- 애플리케이션 서버는 express + ejs + sequelize를 통해 개발되었습니다. 로컬 세팅이 필요하신 분은 문의주세요.

## Setting
- prerequisite: node **8+**
- multi-user environment & using global node
  ```
  git clone https://github.com/songjein/tdls
  cd tdls ; npm i
  echo 'export PATH=$PATH:<PATH-TO-tdls;절대경로>/cmd' >> ~/.bashrc
  source ~/.bashrc
  ```
- single-user environment
  ```
  git clone https://github.com/songjein/tdls
  cd tdls ; sudo npm i -g
  ```

## Register
  ```
  td kegen
  td setinfo
  ```
  
## Blogging
  ```
  td log -f 'markdown_file_path'
  ```

## Todo-list examples
  - co ; change order
  - lsf ; list finished items
  ```
  td add -m 'schedule or memo...' 
  td ls 
  td fin -i index_of_todo_item 
  td lsf 
  td rm -i index_of_todo_item 
  td co -1 first_index -2 second_index
  ```

![Alt text](./images/td.PNG)

## Usage
> ## td -h 
>> 지원하는 명령어를 확인할 수 있습니다.
<pre>
  Usage: td [options] [command]

  Options:

    -v, --version  output the version number
    -h, --help     output usage information

  Commands:

    add|a          add todo item
    ls|l           list todo items
    lsf|lf         list finished todo items
    co|c           change order of two items
    fin|f          finish todo item
    rm|r           remove todo item
    keygen|kg      generate key through https://tdls.dev
    setinfo|si     set user info through https://tdls.dev
    log|lg         write tech-blog article to https://tdls.dev using markdown file
    ...
    help [cmd]     display help for [cmd]
</pre>
