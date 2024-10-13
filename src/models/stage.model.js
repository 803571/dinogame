// key는 uuid사용, value는 array를 사용 -> stage정보는 복수라서 여러개가 들어갈 수 있으니 배열에 집어넣고 관리
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};


export const clearStage = (uuid) => {
  stages[uuid] = [];
}