export class ZoomTransition {
    static async execute(fromScene, toScene, duration = 1000) {
        return new Promise(resolve => {
            if (fromScene) {
                fromScene.style.transform = 'scale(1)';
                fromScene.style.opacity = '1';
                fromScene.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
                requestAnimationFrame(() => {
                    fromScene.style.transform = 'scale(1.5)';
                    fromScene.style.opacity = '0';
                });
            }

            toScene.style.transform = 'scale(0.5)';
            toScene.style.opacity = '0';
            toScene.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                toScene.style.transform = 'scale(1)';
                toScene.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    }
} 