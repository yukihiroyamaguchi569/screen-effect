export class SlideTransition {
    static async execute(fromScene, toScene, duration = 1000) {
        return new Promise(resolve => {
            if (fromScene) {
                fromScene.style.transform = 'translateX(0)';
                fromScene.style.transition = `transform ${duration}ms ease`;
                requestAnimationFrame(() => {
                    fromScene.style.transform = 'translateX(-100%)';
                });
            }

            toScene.style.transform = 'translateX(100%)';
            toScene.style.transition = `transform ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                toScene.style.transform = 'translateX(0)';
                setTimeout(resolve, duration);
            });
        });
    }
} 