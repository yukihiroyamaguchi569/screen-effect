import { FadeTransition } from '../transitions/fade.js';

export class SceneManager {
    constructor() {
        this.currentScene = null;
        this.currentSceneName = null;
        this.scenes = new Map();
        this.container = document.getElementById('scene-container');
        this.sceneOrder = [
            'title',
            'schoolGate',
            'principalsOffice',
            'managerRoom',
            'ruinedDoor'
        ];
        this.currentSceneIndex = 0;
    }

    initialize() {
        // シーンの作成
        this.createScene('title', '../src/images/title.png');
        this.createScene('schoolGate', '../src/images/school-gate.png');
        this.createScene('principalsOffice', '../src/images/principals-office.png');
        this.createScene('managerRoom', '../src/images/manager-room-door.png');
        this.createScene('ruinedDoor', '../src/images/ruined-door.jpg');
        
        // 最初のシーンを表示
        this.showScene('title');

        // イベントリスナーの設定
        document.getElementById('nextScene').addEventListener('click', () => {
            this.nextScene();
        });
    }

    createScene(name, backgroundImage) {
        const scene = document.createElement('div');
        scene.className = 'scene';
        scene.style.backgroundImage = `url(${backgroundImage})`;
        this.scenes.set(name, scene);
    }

    async showScene(sceneName) {
        const scene = this.scenes.get(sceneName);
        if (!scene) return;

        const previousScene = this.currentScene;
        
        if (previousScene) {
            await FadeTransition.execute(previousScene, scene);
            this.container.removeChild(previousScene);
        } else {
            await FadeTransition.execute(null, scene);
        }

        this.container.appendChild(scene);
        this.currentScene = scene;
        this.currentSceneName = sceneName;
    }

    nextScene() {
        this.currentSceneIndex = (this.currentSceneIndex + 1) % this.sceneOrder.length;
        const nextSceneName = this.sceneOrder[this.currentSceneIndex];
        this.showScene(nextSceneName);
    }
} 