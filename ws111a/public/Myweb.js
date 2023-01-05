window.onhashchange = async function () {
  var tokens = window.location.hash.split('/')
  var user
  switch (tokens[0]) {
    case '#home':
      await home()
      break
    case '#signup':
      await signup()
      break
    case '#login':
      await login()
      break
    case '#userSays':
      let user = uriDecode(tokens[1])
      await userSays(user)
      break
    case '#playgame':
      await playgame()
      break;
    case '#legends':
      await legends()
      break;
    case '#seasons':
      await seasons()
      break;
    default:
      console.log(`Error:hash=${tokens[0]}`)
      // Ui.goto('#home')
      break
  }
}

window.onload = function () {
  window.onhashchange()
}

async function home() {
  Ui.show(`<h2>個人資料</h2>
  <img src = https://upload.cc/i1/2022/05/06/bdj9VP.jpg alt = "大頭照" width="150">
  <p>姓名:黃柏鈞</p>
  <p>生日:92/04/30</p>
  <p>興趣:玩遊戲、看影片、煮東西</p>
  <p>Gmail:a0902301355@gmail.com</p>
  <p>學歷:自強國小/自強國中/中和高中</p>
  <p>目前就讀:國立金門大學資訊工程學系</p>`)
}

async function signup() {
  Ui.show(`
  <form>
  <h1>註冊</h1>
  <p><input type="text" placeholder="使用者" id="user"></p>
  <p><input type="password" placeholder="密碼" id="password"></p>
  <p><input type="email" placeholder="電子信箱" id="email"></p>
  <p><button onclick="serverSignup()">註冊</button></p>
  </form>`)
}

async function login() {
  Ui.show(`
  <form>
  <h1>登入</h1>
  <p><input type="text" placeholder="使用者" id="user"></p>
  <p><input type="password" placeholder="密碼" id="password"></p>
  <p><button onclick="serverLogin()">登入</button></p>
  </form>`)
}

async function serverSignup() {
  let user = Ui.id('user').value
  let password = Ui.id('password').value
  let email = Ui.id('email').value
  let r = await Server.post('/signup', {user, password, email})
  console.log('serverLogin: r=', r)
  if (r.status == Status.OK) {
    alert('註冊成功，開始登入使用!')
    Ui.goto('#login')
  } else {
    alert('註冊失敗，請選擇另一個使用者名稱!')
  }
}

async function serverLogin() {
  let user = Ui.id('user').value
  let password = Ui.id('password').value
  let r = await Server.post('/login', {user, password})
  console.log('serverLogin: r=', r)
  if (r.status == Status.OK) {
    localStorage.setItem('user', user)
    alert('登入成功歡迎' + user)
    Ui.goto(`#playgame/${user}`)
  } else
    alert('登入失敗: 請輸入正確的帳號密碼!')
}
var c = 0
var number = 10
var timeoutID = setInterval(1000)
async function playgame() {
  Ui.show(`
  <br>
  <br>
  <p id="count">目前點擊次數:</p>
  <div id="timer">10</div>
  <button onclick="start()">game start</button>
  <button onclick="reset()">game reset</button>
  <br>
  <button onclick="rank()">儲存紀錄</button>
  <br>
  <div>
    <button><img src="https://upload.cc/i1/2022/11/21/EVsnQk.png" width="300" height="300" alt="圖片" onclick="game()"></button>
  </div>
  `)
}

async function game() {
  let r = document.getElementById("count")
  c += 1
  r.innerHTML = `目前點擊次數:${c}`

  if(number == 0){
    document.getElementById("Button").disabled = true;
  }
}

async function start(){
  var timer = document.querySelector("#timer");
  timeoutID = setInterval(function(){
    number -- ;
    if(number <= 0 )
      number = 0;
    timer.innerText = number + 0 }, 1000);
    if(number == 0){
      timeoutID = clearInterval(timeoutID)
    }
  return game
}

async function reset(){
  number = 10
  timeoutID = clearInterval(timeoutID)
  c = 0
}

async function rank(){
  let user = localStorage.getItem('user')
  let r = await Server.post('/rank', {user, c})
  if (r.status == Status.OK){
    alert("已儲存紀錄")
  }
  else{alert("儲存失敗")}
}

async function legends() {
  Ui.show(`<h1>Apex 人物整理</h1>
  <h2>Apex Legends</h2>
  <div class="legends">
  <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/bloodhound?isLocalized=true">
    <img src="https://upload.cc/i1/2022/06/16/3onyG2.png" alt="Bloodhound" width="652" height="730">
  </a>
  <div class="desc">Bloodhound</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/makoa-gibraltar?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/N7Yxwq.png" alt="Gibraltar" width="652" height="730">
    </a>
    <div class="desc">Gibraltar</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/lifeline?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/AQn90D.png" alt="Lifeline" width="652" height="730">
    </a>
    <div class="desc">Lifeline</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/pathfinder?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/sGFjZc.png" alt="Pathfinder" width="652" height="730">
    </a>
    <div class="desc">Pathfinder</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/wraith?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/4X35mS.png" alt="Wraith" width="652" height="730">
    </a>
    <div class="desc">Wraith</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/bangalore?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/Uwoiud.png" alt="Bangalore" width="652" height="730">
    </a>
    <div class="desc">Bangalore</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/caustic?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/4eWUSg.png" alt="Caustic" width="652" height="730">
    </a>
    <div class="desc">Caustic</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/mirage?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/dAmr14.png" alt="Mirage" width="652" height="730">
    </a>
    <div class="desc">Mirage</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/octane?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/EWvaeI.png" alt="Octane" width="652" height="730">
    </a>
    <div class="desc">Octane</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/wattson?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/ewVc6Y.png" alt="Wattson" width="652" height="730">
    </a>
    <div class="desc">Wattson</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/crypto?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/OQEkNS.png" alt="Crypto" width="652" height="730">
    </a>
    <div class="desc">Crypto</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/revenant?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/ydxXc6.png" alt="Revenant" width="652" height="730">
    </a>
    <div class="desc">Revenant</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/loba?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/gTyuK9.png" alt="Loba" width="652" height="730">
    </a>
    <div class="desc">Loba</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/rampart?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/Dlzfae.png" alt="Rampart" width="652" height="730">
    </a>
    <div class="desc">Rampart</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/horizon?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/CsTGFd.png" alt="Horizon" width="652" height="730">
    </a>
    <div class="desc">Horizon</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/fuse?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/tdYM6A.png" alt="Fuse" width="652" height="730">
    </a>
    <div class="desc">Fuse</div>
  </div>

  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/valkyrie?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/JauvnX.png" alt="Valkyrie" width="652" height="730">
    </a>
    <div class="desc">Valkyrie</div>
  </div>
  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/seer?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/8gSraP.png" alt="Seer" width="652" height="730">
    </a>
    <div class="desc">Seer</div>
  </div>
  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/ash?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/ZQefWL.png" alt="Ash" width="652" height="730">
    </a>
    <div class="desc">Ash</div>
  </div>
  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/mad-maggie?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/o0Y7vi.png" alt="Mad Maggie" width="652" height="730">
    </a>
    <div class="desc">Mad Maggie</div>
  </div>
  <div class="legends">
    <a target="_blank" href="https://www.ea.com/games/apex-legends/about/characters/newcastle?isLocalized=true">
      <img src="https://upload.cc/i1/2022/06/16/HZWLOy.png" alt="Newcastle" width="652" height="730">
    </a>
    <div class="desc">Newcastle</div>
  </div>`)
}

async function seasons(){
  Ui.show(`<h1>Apex 各季影片整理</h1>
  <h2>Apex Seasons</h2>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/7M4Vds3fI9E">
        <img src="https://upload.cc/i1/2022/06/16/CVZEvf.png" alt="Season1" width="640" height="360">
      </a>
      <div class="desc">Season1</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/zsUd40fvFm8">
        <img src="https://upload.cc/i1/2022/06/16/UPC4bE.png" alt="Season2" width="640" height="360">
      </a>
      <div class="desc">Season2</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/C3q_SibAOc4">
        <img src="https://upload.cc/i1/2022/06/16/OrComG.png" alt="Season3" width="640" height="360">
      </a>
      <div class="desc">Season3</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/DFY_scgPl80">
        <img src="https://upload.cc/i1/2022/06/16/lCmgMA.png" alt="Season4" width="640" height="360">
      </a>
      <div class="desc">Season4</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/quACziGJqQM">
        <img src="https://upload.cc/i1/2022/06/16/y82Cne.png" alt="Season5" width="640" height="360">
      </a>
      <div class="desc">Season5</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/SCUXdRb5abU">
        <img src="https://upload.cc/i1/2022/06/16/wjZFWJ.png" alt="Season6" width="640" height="360">
      </a>
      <div class="desc">Season6</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/YV12-kknruM">
        <img src="https://upload.cc/i1/2022/06/16/w6BUjv.png" alt="Season7" width="640" height="360">
      </a>
      <div class="desc">Season7</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/Z-xDoDSDM2Y">
        <img src="https://upload.cc/i1/2022/06/16/4eIfXV.png" alt="Season8" width="640" height="360">
      </a>
      <div class="desc">Season8</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/ChZaqqoNg-0">
        <img src="https://upload.cc/i1/2022/06/16/yVGQzx.png" alt="Season9" width="640" height="360">
      </a>
      <div class="desc">Season9</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/bOD88NwyShM">
        <img src="https://upload.cc/i1/2022/06/16/Bg6cJt.png" alt="Season10" width="640" height="360">
      </a>
      <div class="desc">Season10</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/N-7j2ejytyI">
        <img src="https://upload.cc/i1/2022/06/16/J9VQGq.png" alt="Season11" width="640" height="360">
      </a>
      <div class="desc">Season11</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/OtVABKfc_AE">
        <img src="https://upload.cc/i1/2022/06/16/pehRxr.png" alt="Season12" width="640" height="360">
      </a>
      <div class="desc">Season12</div>
  </div>
  <div class="seasons">
      <a target="_blank" href="https://youtu.be/cOFuEQEvC3E">
        <img src="https://upload.cc/i1/2022/06/16/4CYo9P.png" alt="Season13" width="640" height="360">
      </a>
      <div class="desc">Season13</div>
  </div>`)
}

// ====================== Server ====================
const Server = {}

Server.get = async function(path) {
  let r = await window.fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return {status:r.status, obj:await r.json()}
}

Server.post = async function(path, params) {
  let r = await window.fetch(path, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return {status:r.status, obj:await r.json()}
}

const Status = {
  OK:200,
  Fail:400,
  Unauthorized:401,
  Forbidden:403,
  NotFound:404,
}

// ========================= Ui ======================
const Ui = {}

Ui.id = function(path) {
  return document.getElementById(path)
}

Ui.one = function(path) {
  return document.querySelector(path)
}

Ui.showPanel = function(name) {
  document.querySelectorAll('.panel').forEach((node)=>node.style.display='none')
  Ui.id(name).style.display = 'block'
}

Ui.show = function (html) {
  Ui.id('main').innerHTML = html
}

Ui.openNav = function () {
  Ui.id('mySidenav').style.width = '200px'
}

Ui.closeNav = function () {
  Ui.id('mySidenav').style.width = '0'
}

Ui.goto = function (hash) {
  window.location.hash = hash
}
