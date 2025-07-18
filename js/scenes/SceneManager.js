import { FadeTransition } from '../transitions/fade.js';
import { SlideTransition } from '../transitions/slide.js';
import { ZoomTransition } from '../transitions/zoom.js';
import { CurtainTransition } from '../transitions/curtain.js';

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
        this.currentEffect = 'fade';
        this.transitions = {
            fade: FadeTransition,
            slide: SlideTransition,
            zoom: ZoomTransition,
            curtain: CurtainTransition
        };
    }

    initialize() {
        // シーンの作成
        this.createScene('title', '../src/images/title.png');
        this.createScene('schoolGate', '../src/images/school-gate.png');
        this.createScene('principalsOffice', '../src/images/principals-office.png');

        
        // 最初のシーンを表示
        this.showScene('title');

        // イベントリスナーの設定
        document.getElementById('nextScene').addEventListener('click', () => {
            this.nextScene();
        });

        // エフェクトボタンのイベントリスナー設定
        document.querySelectorAll('.effect-button').forEach(button => {
            button.addEventListener('click', () => {
                // 現在のアクティブボタンを非アクティブに
                document.querySelector('.effect-button.active').classList.remove('active');
                // クリックされたボタンをアクティブに
                button.classList.add('active');
                // エフェクトを設定
                this.currentEffect = button.dataset.effect;
            });
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
        const transition = this.transitions[this.currentEffect];
        
        if (previousScene) {
            await transition.execute(previousScene, scene);
            this.container.removeChild(previousScene);
        } else {
            await transition.execute(null, scene);
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