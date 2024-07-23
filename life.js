const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

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

			if (distance > 0 && distance < 80) {
				const force = gravity * (1 / distance);
				forceX += force * dx;
				forceY += force * dy;
			}
		}

		group1[i].vx = (group1[i].vx + forceX) * 0.5;
		group1[i].vy = (group1[i].vy + forceY) * 0.5;
		group1[i].x += group1[i].vx;
		group1[i].y += group1[i].vy;

		if (
			group1[i].x <= 0 ||
			group1[i].x >= canvas.width / (window.devicePixelRatio || 1)
		)
			group1[i].vx *= -1;
		if (
			group1[i].y <= 0 ||
			group1[i].y >= canvas.height / (window.devicePixelRatio || 1)
		)
			group1[i].vy *= -1;
	}
};

const groupAqua = createParticles(1000, 'aqua');
const groupRed = createParticles(600, 'red');
const groupGreen = createParticles(500, '#65fe08');

const render = () => {
	applyForces(groupRed, groupRed, -0.32);
	applyForces(groupRed, groupGreen, -0.15);
	applyForces(groupRed, groupAqua, 0.3);
	applyForces(groupGreen, groupGreen, -0.6);
	applyForces(groupGreen, groupRed, 0.35);
	applyForces(groupAqua, groupAqua, 1);
	applyForces(groupAqua, groupRed, -0.25);

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#0f0f0f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < particles.length; i++) {
		drawCircle(particles[i].x, particles[i].y, particles[i].color, 5);
	}
	requestAnimationFrame(render);
};

window.addEventListener('resize', () => {
	resizeCanvas();
});

resizeCanvas();
render();
