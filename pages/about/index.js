import { gsap } from 'gsap'

import { TextPlugin } from 'gsap/TextPlugin'

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(TextPlugin, SplitText)

document.addEventListener('DOMContentLoaded', () => {
	// Ваш существующий код для экранов >= 480 пикселей
	gsap.registerPlugin(ScrollTrigger, SplitText)

	gsap
		.timeline({
			scrollTrigger: {
				trigger: '.section_history',
				start: 'bottom 90%',
				end: 'bottom bottom',
				scrub: 3,
			},
		})
		.to('.section_history .max-width-794', { opacity: 0, duration: 2 })

	document.querySelectorAll('.dates-item').forEach((card, i) => {
		const bigCircle = card.querySelector('.dates-item-circle-big')
		const smallCircle = card.querySelector('.dates-item-circle-small')
		const paragraph = card.querySelector('p')

		if (bigCircle && smallCircle && paragraph) {
			if (window.innerWidth < 480) {
				// Mobile version: trigger section_history and animate cards every 25% of the scroll
				ScrollTrigger.create({
					trigger: '.section_history',
					start: `${i * 25}% top`,
					end: `${(i + 1) * 25}% top`,
					toggleActions: 'play none none reverse',
					onEnter: () => {
						gsap.to(bigCircle, { backgroundColor: '#811723', duration: 1 })
						gsap.to(smallCircle, { backgroundColor: '#811723', duration: 1 })
						gsap.to(paragraph, { color: '#ffffff', duration: 1 })
					},
					onLeaveBack: () => {
						gsap.to(bigCircle, { backgroundColor: '#DCDCDC', duration: 1 })
						gsap.to(smallCircle, { backgroundColor: '#DCDCDC', duration: 1 })
						gsap.to(paragraph, { color: '#1B1310', duration: 1 })
					},
				})
			} else {
				// Desktop version: original trigger on each card
				gsap
					.timeline({
						scrollTrigger: {
							trigger: card,
							start: 'bottom 80%',
							end: 'bottom top',
							toggleActions: 'play reverse play reverse',
						},
					})
					.to(bigCircle, { backgroundColor: '#811723', duration: 1 })
					.to(smallCircle, { backgroundColor: '#811723', duration: 1 }, '-=1')
					.to(paragraph, { color: '#ffffff', duration: 1 }, '-=1')
			}
		} else {
			console.error('One or more required elements not found in card:', card)
		}
	})

	const items = document.querySelectorAll('.roadmap_list .roadmap_item')
	const texts = [],
		titles = [],
		descriptions = []

	items.forEach((item) => {
		texts.push(item.querySelector('.road_date').textContent)
		titles.push(item.querySelector('h3').textContent)
		descriptions.push(item.querySelector('.road_text').textContent)
	})

	const tag = document.querySelector('.history_content-left .tag p')
	const h3 = document.querySelector('.history_content-left h3')
	const historyText = document.querySelector(
		'.history_content-left .history-text'
	)
	const images = document.querySelectorAll(
		'.history_content-image .image-absolute'
	)

	let splitText = new SplitText(tag, { type: 'chars' })
	let chars = splitText.chars

	const animateText = (newText, newTitle, newDescription) => {
		gsap.to(chars, {
			opacity: 0,
			y: -30,
			duration: 0.2,
			stagger: 0.02,
			onComplete: () => {
				splitText.revert()
				tag.textContent = newText
				splitText = new SplitText(tag, { type: 'chars' })
				chars = splitText.chars
				gsap.fromTo(
					chars,
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 0.2, stagger: 0.02 }
				)
			},
		})

		gsap.to(h3, {
			duration: 0.6,
			opacity: 0,
			onComplete: () => {
				h3.textContent = newTitle
				gsap.to(h3, { opacity: 1, duration: 0.6 })
			},
		})
		gsap.to(historyText, {
			duration: 0.6,
			opacity: 0,
			onComplete: () => {
				historyText.textContent = newDescription
				gsap.to(historyText, { opacity: 1, duration: 0.6 })
			},
		})
	}

	images.forEach((img, i) => {
		if (i >= texts.length) return // Prevent index out of bounds

		ScrollTrigger.create({
			trigger: '.section_history',
			start: `${25 + i * 25}% 25%`,
			end: `${25 + (i + 1) * 25}% 25%`,
			toggleActions: 'play reverse play reverse',
			scrub: true,
			onEnter: () => {
				if (i + 1 < texts.length) {
					// Prevent index out of bounds
					images.forEach((image, index) => {
						if (index !== i + 1) gsap.to(image, { opacity: 0, duration: 1 })
					})
					gsap.to(images[i + 1], { opacity: 1, duration: 1 })
					animateText(texts[i + 1], titles[i + 1], descriptions[i + 1])
				}
			},
			onLeaveBack: () => {
				if (i + 1 < texts.length) {
					// Prevent index out of bounds
					gsap.to(images[i + 1], { opacity: 0, duration: 1 })
				}
				if (i > 0) {
					gsap.to(images[i], { opacity: 1, duration: 1 })
					animateText(texts[i], titles[i], descriptions[i])
				} else {
					gsap.to(images[0], { opacity: 1, duration: 1 })
					animateText(texts[0], titles[0], descriptions[0])
				}
			},
		})
	})
})
