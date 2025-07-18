export class FadeTransition {
    static async execute(fromScene, toScene, duration = 1000) {
        return new Promise(resolve => {
            if (fromScene) {
                fromScene.style.opacity = '1';
                fromScene.style.transition = `opacity ${duration}ms ease`;
                requestAnimationFrame(() => {
                    fromScene.style.opacity = '0';
                });
            }

            toScene.style.opacity = '0';
            toScene.style.transition = `opacity ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                toScene.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    }
} 