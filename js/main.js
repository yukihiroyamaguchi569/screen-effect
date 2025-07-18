import { SceneManager } from './scenes/SceneManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const sceneManager = new SceneManager();
    sceneManager.initialize();

    // キーボードイベントの追加
    document.addEventListener('keydown', (event) => {
        // スペースキーまたは右矢印キーで次のシーンへ
        if (event.code === 'Space' || event.code === 'ArrowRight') {
            sceneManager.nextScene();
        }
    });
}); 