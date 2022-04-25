const ref = firebase.database().ref("Game");
let GameStatus = false;
let Gameturn = "x";
const logoutItems = document.querySelectorAll(".logged-out");
const loginItems = document.querySelectorAll(".logged-in");

function setupUI(user) {
  if (user) {
    document.getElementById("user-profile-name").innerHTML = user.email;
    loginItems.forEach((item) => (item.style.display = "inline-block"));
    logoutItems.forEach((item) => (item.style.display = "none"));
  } else {
    loginItems.forEach((item) => (item.style.display = "none"));
    logoutItems.forEach((item) => (item.style.display = "inline-block"));
  }
}

ref.on("value", (snapshot) => {
  getGameInfo(snapshot);
});

function getGameInfo(snapshot) {
  document.getElementById("inputPlayer-x").value = "";
  document.getElementById("inputPlayer-o").value = "";
  document.querySelector(".playerTurn").innerHTML = "Waiting for Player...";
  const btnJoins = document.querySelectorAll(".btn-join");
  btnJoins.forEach((btnJoin) => (btnJoin.disabled = false));
  const btnCancels = document.querySelectorAll(".btn-cancel-join-game");
  btnCancels.forEach((btnCancel) => (btnCancel.disabled = true));
  const btnTables = document.querySelectorAll(".table-col");
  btnTables.forEach((btnTable) => (btnTable.innerHTML = ""));

  snapshot.forEach((data) => {
    const gameInfos = data.val();
    console.log(gameInfos);
    Object.keys(gameInfos).forEach((key) => {
      switch (key) {
        case "user-x-email":
          playerx = gameInfos[key];
          document.getElementById("inputPlayer-x").value = gameInfos[key];
          document.querySelector("#btnJoin-x").disabled = true;
          if (gameInfos[key] === firebase.auth().currentUser.email) {
            document.querySelector("#btnCancel-x").disabled = false;
            document.querySelector("#btnJoin-o").disabled = true;
          } else {
            document.querySelector("#btnCancel-x").disabled = true;
          }
          break;
        case "user-o-email":
          playero = gameInfos[key];
          document.getElementById("inputPlayer-o").value = gameInfos[key];
          document.querySelector("#btnJoin-o").disabled = true;
          if (gameInfos[key] === firebase.auth().currentUser.email) {
            document.querySelector("#btnCancel-o").disabled = false;
            document.querySelector("#btnJoin-x").disabled = true;
          } else {
            document.querySelector("#btnCancel-o").disabled = true;
          }
          break;
        case "status":
          GameStatus = gameInfos[key];
          break;
        case "turn":
          turn = gameInfos[key];
          break;
        case "table":
          Object.keys(gameInfos[key]).forEach((table) => {
            document.getElementById(table).innerHTML = gameInfos[key][table];
            document.getElementById(table).disabled = true;
          });
          break;
      }
    });
  });
  if (
    document.getElementById(`inputPlayer-x`).value &&
    document.getElementById(`inputPlayer-o`).value
  ) {
    document.querySelector("#btnStartGame").disabled = GameStatus;
  } else {
    document.querySelector("#btnStartGame").disabled = true;
  }
  if (GameStatus) {
    const btnCancels = document.querySelectorAll(".btn-cancel-join-game");
    btnCancels.forEach((btnCancel) => (btnCancel.disabled = true));
    document.querySelector(".playerTurn").innerHTML = "Player : " + turn;
  }
}

const btnCancels = document.querySelectorAll(".btn-cancel-join-game");
btnCancels.forEach((btnCancel) =>
  btnCancel.addEventListener("click", canceljoin)
);

function canceljoin(event) {
  const currentUser = firebase.auth().currentUser;
  console.log("[Cancel] Current user:", currentUser);
  if (currentUser) {
    const btnCanceID = event.currentTarget.getAttribute("id");
    const player = btnCanceID[btnCanceID.length - 1];
    const playerForm = document.getElementById(`inputPlayer-${player}`);
    if (playerForm.value && playerForm.value === currentUser.email) {
      // Delete player from database
      let tmpID = `user-${player}-id`;
      let tmpEmail = `user-${player}-email`;
      ref.child("game-1").child(tmpID).remove();
      ref.child("game-1").child(tmpEmail).remove();
      console.log(`delete on id: ${currentUser.uid}`);
    }
  }
}

const btnJoins = document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoin) => btnJoin.addEventListener("click", joinGame));

function joinGame(event) {
  const currentUser = firebase.auth().currentUser;
  console.log("[Join] Current user:", currentUser);
  if (currentUser) {
    const btnJoinID = event.currentTarget.getAttribute("id");
    const player = btnJoinID[btnJoinID.length - 1];

    const playerForm = document.getElementById(`inputPlayer-${player}`);
    if (playerForm.value == "") {
      // Add player into database
      let tmpID = `user-${player}-id`;
      let tmpEmail = `user-${player}-email`;
      ref.child("game-1").update({
        [tmpID]: currentUser.uid,
        [tmpEmail]: currentUser.email,
      });
      console.log(currentUser.email + " added.");
    }
  }
}

const btnStart = document.getElementById(`btnStartGame`);
btnStart.addEventListener("click", startGame);

function startGame() {
  ref.child("game-1").update({
    status: true,
    turn: "x",
  });
}

const btnEnd = document.getElementById(`btnTerminateGame`);
btnEnd.addEventListener("click", endGame);

function endGame() {
  ref.child("game-1").update({
    status: false,
  });
  ref.child("game-1").child("table").remove();
}

const btnGames = document.querySelectorAll(".table-col");
btnGames.forEach((btnGame) => btnGame.addEventListener("click", playGame));

function playGame(event) {
  if (GameStatus) {
    const currentUser = firebase.auth().currentUser;
    const btnGameID = event.currentTarget.getAttribute("id");

    if (
      document.getElementById(`inputPlayer-${turn}`).value ===
        currentUser.email &&
      !document.getElementById(btnGameID).innerHTML
    ) {
      console.log(event.currentTarget.getAttribute("id"));
      ref
        .child("game-1")
        .child("table")
        .update({
          [btnGameID]: turn,
        });
      if (turn === "x") {
        ref.child("game-1").update({
          turn: "o",
        });
      } else {
        ref.child("game-1").update({
          turn: "x",
        });
      }
    }
    // calculateWinner();
  }
}

// function calculateWinner() {

//   for (const v of ['x', 'o']){
//     if (boards["row-1-col-1"] === v && boards["row-1-col-2"] === v  && boards["row-1-col-3"] === v){
//       ref.child("game-1").update({
//         status: false,
//         winner: v,
//         [`user-${v}-score`]: scores[`user-${v}-score`]+3
//       });

//       break
//     }
//     else if (boards["row-2-col-1"] === v && boards["row-2-col-2"] === v  && boards["row-2-col-3"] === v){
//       ref.child("game-1").update({
//         status: false,
//         winner: v,
//         [`user-${v}-score`]: scores[`user-${v}-score`] +3
//       });
//       break
//     }
//     else if (boards["row-3-col-1"] === v && boards["row-3-col-2"] === v  && boards["row-3-col-3"] === v){
//       ref.child("game-1").update({
//         status: false,
//         winner: v,
//         [`user-${v}-score`]: scores[`user-${v}-score`]+3
//       });
//       break
//     }

//     else {
//       // เสมอ
//     }
//   }
// }
