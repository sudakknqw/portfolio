// Soft "quint out": gentle start, long glide — nothing snaps into place
export const easeExpo = [0.22, 1, 0.36, 1] as const;

// Smooths scroll-linked values so parallax glides instead of stepping with each wheel tick
export const scrollSpring = { stiffness: 70, damping: 24, mass: 0.6, restDelta: 0.0005 };
