const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const particlesSize = window.innerWidth <= 500 ? 3.5 : 6;

const resizeCanvas = () => {
	const dpr = window.devicePixelRatio || 1;
	canvas.width = window.innerWidth * dpr;
	canvas.height = window.innerHeight * dpr;
	context.scale(dpr, dpr);
};

const drawCircle = (x, y, color, size) => {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, size / 2, 0, Math.PI * 2);
	context.fill();
};

const particles = [];
const createParticle = (x, y, color) => {
	return {
		x,
		y,
		vx: 0,
		vy: 0,
		color,
	};
};

const getRandomPosition = axis => {
	return Math.random() * (axis - 100) + 50;
};

const createParticles = (amount, color) => {
	const group = [];
	for (let i = 0; i < amount; i++) {
		const particle = createParticle(
			getRandomPosition(canvas.width / (window.devicePixelRatio || 1)),
			getRandomPosition(canvas.height / (window.devicePixelRatio || 1)),
			color
		);
		group.push(particle);
		particles.push(particle);
	}
	return group;
};

const applyForces = (group1, group2, gravity) => {
	for (let i = 0; i < group1.length; i++) {
		let forceX = 0,
			forceY = 0;

		for (let j = 0; j < group2.length; j++) {
			let particle1 = group1[i],
				particle2 = group2[j],
				dx = particle1.x - particle2.x,
				dy = particle1.y - particle2.y,
				distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > 0 && distance < 100) {
				const force = gravity * (1 / distance);
				forceX += force * dx;
				forceY += force * dy;
			}
		}

		group1[i].vx = (group1[i].vx + forceX) * 0.45;
		group1[i].vy = (group1[i].vy + forceY) * 0.45;
		group1[i].x += group1[i].vx;
		group1[i].y += group1[i].vy;

		// Здесь по сути и функционал "стен" канваса:
		// если частица 'касается' стен, то направление
		// её движения меняется на противоположное.
		// В какой-то мере работает, но некоторые наглеют
		// и всё равно выходят за канвас.
		// (В данной конфигурации - все зеленые частицы почти
		//  мгновенно улетают за пределы).
		// ⬇

		// if (
		// 	group1[i].x <= 0 ||
		// 	group1[i].x >= canvas.width / (window.devicePixelRatio || 1)
		// ) {
		// 	group1[i].vx *= -1;
		// } else if (
		// 	group1[i].y <= 0 ||
		// 	group1[i].y >= canvas.height / (window.devicePixelRatio || 1)
		// ) {
		// 	group1[i].vy *= -1;
		// }

		// ИСПРАВЛЕНО:
		// Частицы вылетали за границы канваса, потому что при пересечении границ
		// их скорость менялась на противоположную, 
    // но их положение оставалось за пределами канваса.
		// Корректируем положение частиц после пересечения границ,
		// установив их координаты на границу канваса, если они выходят за пределы.
		// ⬇
		
		if (group1[i].x <= 0) {
			group1[i].x = 0;
			group1[i].vx *= -1;
		} else if (group1[i].x >= canvas.width / (window.devicePixelRatio || 1)) {
			group1[i].x = canvas.width / (window.devicePixelRatio || 1);
			group1[i].vx *= -1;
		}
		if (group1[i].y <= 0) {
			group1[i].y = 0;
			group1[i].vy *= -1;
		} else if (group1[i].y >= canvas.height / (window.devicePixelRatio || 1)) {
			group1[i].y = canvas.height / (window.devicePixelRatio || 1);
			group1[i].vy *= -1;
		}
	}
};

const groupAqua = createParticles(1500, 'aqua');
const groupRed = createParticles(500, 'red');
const groupGreen = createParticles(500, '#65fe08');

const render = () => {
	applyForces(groupRed, groupRed, -0.7);
	applyForces(groupRed, groupGreen, -0.15);
	applyForces(groupRed, groupAqua, 0.3);
	applyForces(groupGreen, groupGreen, -1);
	applyForces(groupGreen, groupRed, 0.5);
	applyForces(groupAqua, groupAqua, 0.5);
	applyForces(groupAqua, groupRed, -0.25);

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#0f0f0f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < particles.length; i++) {
		drawCircle(
			particles[i].x,
			particles[i].y,
			particles[i].color,
			particlesSize
		);
	}
	requestAnimationFrame(render);
};

window.addEventListener('resize', () => {
	resizeCanvas();
});

resizeCanvas();
render();
