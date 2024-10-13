import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



 // 현재 파일의 절대경로
const __filename = fileURLToPath(import.meta.url);
 // '이 파일'의 위치, 파일이름 빼고 디렉토리 경로만
const __dirname = path.dirname(__filename);

// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../public/assets'); // 이 파일의 위치만 경로를 뽑아냄. 뒤로 두번 간 만큼
 // 전역변수
let gameAssets = {};

// 파일 읽는 함수
// 파일을 비동기 병렬로 읽습니다. 한번에 같이 처리가 된다~

const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        })
    }) 
}
// utf8이란 우리가 읽을 수 있는 문자로 바꿔준다 라는 뜻 쉽게말해서 ㅇㅇ



export const loadGameAssets = async () => {
    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json'),
        ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
    } catch(error) {
        throw new Error('Failed to load Game assets: ' + e.message);
    }
}

export const getGameAssets = () => {
    return gameAssets;
}