const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 120;
const mouse = { x: null, y: null, radius: 150 };

// Resize Canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Particle Class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = '#5170ff'; // Your brand purple
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction Logic
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            const moveX = directionX * force * this.density;
            const moveY = directionY * force * this.density;

            this.x += moveX;
            this.y += moveY;
        } else {
            // Return to original position slowly
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();