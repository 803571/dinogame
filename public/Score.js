import { sendEvent } from "./Socket.js";

class Score {
  score = 0;
  scoreIncrement = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000;
  stageChanged = {};

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.itemTable = itemTable;
    this.itemController = itemController;

    // 모든 스테이지에 대해서 stageChanged 초기화
    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
  }

  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

    // 증가분을 누적합니다.
    this.scoreIncrement += deltaTime * 0.01 * scorePerSecond;

    // 증가분이 scorePerSecond 만큼 쌓이면 score에 반영하고 초기화합니다.
    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }
    this.checkStageChange();

    // this.score += deltaTime * 0.001;
    // // 점수가 100 점 이상이 될 경우 서버에 메시지를 전송
    // if (Math.floor(this.score) === 10 && this.stageChange) {
    //   this.stageChange = false;
    //   sendEvent(11, { currentStage: 1000, targetStage: 1001 });
    // }
  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      // 현재 점수가 스테이지 점수 이상이고, 해당 스테이지로 변경된 적이 없는 경우
      if (
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== 1000
      ) {
        // 이전 스테이지, 바뀐 현재 스테이지
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        // 해당 스테이지로 변경됨을 표시해줍니다.
        this.stageChanged[stage.id] = true;

        // 서버로 이벤트를 전송
        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        // 아이템 컨트롤러에 현 스테이지 설정
        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }

        // 스테이지 변경 후 반복문을 종료합니다.
        break;
      }
    }
  }

  getItem(itemId) {
    const itemInfo = this.itemTabel.find((item) => item.id === itemId);
    if (itemInfo) {
      this.score += itemInfo.score;
      sendEvent(21, { itemId, timestamp: Date.now() });
    }
  }

  reset() {
    this.score = 0;
    this.scoreIncrement = 0;
    this.currentStage = 1000; // 스테이지 초기화

    // 모든 스테이지에 대한 변경 플래그 초기화
    Object.keys(this.stageChanged).forEach((key) => {
      this.stageChanged[key] = false;
    });

    // 아이템 컨트롤러에 현재 스테이지 설정
    if (this.itemController) {
      this.itemController.setCurrentStage(this.currentStage);
    }
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    // 스테이지 표시
    this.drawStage();
  }

  drawStage() {
    const stageY = 50 * this.scaleRatio;
    const fontSize = 30 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = 'black';

    const stageText = `Stage ${this.currentStage - 999}`; // 스테이지 번호 계산
    const stageX = this.canvas.width / 2 - this.ctx.measureText(stageText).width / 2;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Score;
