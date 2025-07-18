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
        this.currentEffect = 'fade';
        this.currentImageEffect = 'none';
        this.transitions = {
            fade: FadeTransition,
            slide: SlideTransition,
            zoom: ZoomTransition,
            curtain: CurtainTransition
        };
        this.isTransitioning = false;
        this.imageFiles = {
            title: '../src/images/title.png',
            schoolGate: '../src/images/school-gate.png',
            kurouzuGate: '../src/images/kurouzu-gate.jpg',
            principalsOffice: '../src/images/principals-office.png',
            ruinedDoor: '../src/images/ruined-door.jpg'
        };
    }

    initialize() {
        // すべてのシーンを作成
        for (const [name, path] of Object.entries(this.imageFiles)) {
            this.createScene(name, path);
        }
        
        // 最初のシーンを表示
        this.resetToTitle();

        // エフェクトボタンのイベントリスナー設定
        document.querySelectorAll('.effect-button').forEach(button => {
            button.addEventListener('click', () => {
                if (this.isTransitioning) return;
                
                // 現在のアクティブボタンを非アクティブに
                document.querySelector('.effect-button.active').classList.remove('active');
                // クリックされたボタンをアクティブに
                button.classList.add('active');
                // エフェクトを設定して実行
                this.currentEffect = button.dataset.effect;
                this.playTransition();
            });
        });

        // 画像エフェクトボタンのイベントリスナー設定
        document.querySelectorAll('.image-effect-button').forEach(button => {
            button.addEventListener('click', () => {
                // 現在のアクティブボタンを非アクティブに
                document.querySelector('.image-effect-button.active').classList.remove('active');
                // クリックされたボタンをアクティブに
                button.classList.add('active');
                // 画像エフェクトを適用
                this.applyImageEffect(button.dataset.imageEffect);
            });
        });

        // 画像セレクターのイベントリスナー設定
        const imageSelector = document.getElementById('image-selector');
        imageSelector.value = 'title'; // デフォルト値を設定
        imageSelector.addEventListener('change', () => {
            this.showSelectedImage(imageSelector.value);
        });
    }

    createScene(name, backgroundImage) {
        const scene = document.createElement('div');
        scene.className = 'scene';
        scene.style.backgroundImage = `url(${backgroundImage})`;
        this.scenes.set(name, scene);
    }

    async showSelectedImage(sceneName) {
        if (this.isTransitioning) return;
        
        const scene = this.scenes.get(sceneName);
        if (!scene) return;

        // コンテナ内の全ての子要素を削除
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        // 選択されたシーンを追加
        scene.style.opacity = '1';  // 確実に表示
        scene.style.transform = 'none';  // 変形をリセット
        scene.style.transition = 'none';  // トランジションを無効化
        
        this.container.appendChild(scene);
        this.currentScene = scene;
        this.currentSceneName = sceneName;

        // 現在の画像エフェクトを適用
        this.applyImageEffect(this.currentImageEffect);

        // 強制的にリフロー
        scene.offsetHeight;
    }

    async showScene(sceneName) {
        const scene = this.scenes.get(sceneName);
        if (!scene) return;

        const previousScene = this.currentScene;
        const transition = this.transitions[this.currentEffect];
        
        if (previousScene) {
            await transition.execute(previousScene, scene);
            if (previousScene.parentNode) {
                this.container.removeChild(previousScene);
            }
        } else {
            await transition.execute(null, scene);
        }

        this.container.appendChild(scene);
        this.currentScene = scene;
        this.currentSceneName = sceneName;
        
        // 画像セレクターの値を更新
        const imageSelector = document.getElementById('image-selector');
        imageSelector.value = sceneName;
        
        // 新しいシーンに現在の画像エフェクトを適用
        this.applyImageEffect(this.currentImageEffect);
    }

    applyImageEffect(effectName) {
        if (!this.currentScene) return;
        
        // 以前のエフェクトクラスをすべて削除
        this.currentScene.classList.remove('sepia', 'grayscale', 'noise', 'pixelate', 'huerotate');
        
        // 新しいエフェクトを適用（「なし」以外の場合）
        if (effectName !== 'none') {
            this.currentScene.classList.add(effectName);
        }
        
        // 現在のエフェクトを記録
        this.currentImageEffect = effectName;
    }

    async playTransition() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // 学校ゲートへの遷移を実行
            await this.showScene('schoolGate');
            
            // 1秒待機
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // タイトルに戻る（エフェクトなし）
            await this.resetToTitle();
        } finally {
            this.isTransitioning = false;
        }
    }

    resetToTitle() {
        // コンテナ内の全ての子要素を削除
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        // タイトルシーンを新しく作成して追加
        const titleScene = this.scenes.get('title');
        titleScene.style.opacity = '1';  // 確実に表示
        titleScene.style.transform = 'none';  // 変形をリセット
        titleScene.style.transition = 'none';  // トランジションを無効化
        
        this.container.appendChild(titleScene);
        this.currentScene = titleScene;
        this.currentSceneName = 'title';

        // 画像セレクターの値を更新
        const imageSelector = document.getElementById('image-selector');
        imageSelector.value = 'title';

        // 現在の画像エフェクトを適用
        this.applyImageEffect(this.currentImageEffect);

        // 強制的にリフロー
        titleScene.offsetHeight;
    }
} 