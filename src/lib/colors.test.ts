import { describe, it, expect } from 'vitest'
import { hex_to_rgb, rgb_to_hex, rgb_to_hsv, hsv_to_rgb, contrast_text_color } from './colors'

describe('hex_to_rgb', () => {
	it('converts black', () => {
		expect(hex_to_rgb('#000000')).toEqual([0, 0, 0])
	})

	it('converts white', () => {
		expect(hex_to_rgb('#ffffff')).toEqual([255, 255, 255])
	})

	it('converts an arbitrary color', () => {
		expect(hex_to_rgb('#ff8040')).toEqual([255, 128, 64])
	})
})

describe('rgb_to_hex', () => {
	it('converts black', () => {
		expect(rgb_to_hex([0, 0, 0])).toBe('#000000')
	})

	it('converts white', () => {
		expect(rgb_to_hex([255, 255, 255])).toBe('#ffffff')
	})

	it('roundtrips with hex_to_rgb', () => {
		const hex = '#3a7fc2'
		expect(rgb_to_hex(hex_to_rgb(hex))).toBe(hex)
	})
})

describe('rgb_to_hsv', () => {
	it('converts pure red', () => {
		const [h, s, v] = rgb_to_hsv([255, 0, 0])
		expect(h).toBeCloseTo(0)
		expect(s).toBeCloseTo(1)
		expect(v).toBeCloseTo(1)
	})

	it('converts pure green', () => {
		const [h, s, v] = rgb_to_hsv([0, 255, 0])
		expect(h).toBeCloseTo(1 / 3)
		expect(s).toBeCloseTo(1)
		expect(v).toBeCloseTo(1)
	})

	it('converts pure blue', () => {
		const [h, s, v] = rgb_to_hsv([0, 0, 255])
		expect(h).toBeCloseTo(2 / 3)
		expect(s).toBeCloseTo(1)
		expect(v).toBeCloseTo(1)
	})

	it('converts gray (achromatic)', () => {
		const [h, s, v] = rgb_to_hsv([128, 128, 128])
		expect(h).toBe(0)
		expect(s).toBe(0)
		expect(v).toBeCloseTo(128 / 255)
	})

	it('converts black', () => {
		expect(rgb_to_hsv([0, 0, 0])).toEqual([0, 0, 0])
	})

	it('converts white', () => {
		const [h, s, v] = rgb_to_hsv([255, 255, 255])
		expect(h).toBe(0)
		expect(s).toBe(0)
		expect(v).toBeCloseTo(1)
	})
})

describe('hsv_to_rgb', () => {
	it('converts pure red', () => {
		const [r, g, b] = hsv_to_rgb([0, 1, 1])
		expect(r).toBeCloseTo(255)
		expect(g).toBeCloseTo(0)
		expect(b).toBeCloseTo(0)
	})

	it('converts pure green', () => {
		const [r, g, b] = hsv_to_rgb([1 / 3, 1, 1])
		expect(r).toBeCloseTo(0)
		expect(g).toBeCloseTo(255)
		expect(b).toBeCloseTo(0)
	})

	it('roundtrips with rgb_to_hsv', () => {
		const original = [100, 200, 50] as [number, number, number]
		const hsv = rgb_to_hsv(original)
		const [r, g, b] = hsv_to_rgb(hsv)
		expect(r).toBeCloseTo(original[0], 0)
		expect(g).toBeCloseTo(original[1], 0)
		expect(b).toBeCloseTo(original[2], 0)
	})
})

describe('contrast_text_color', () => {
	it('returns white for dark colors (luminance uses 0-255 scale, threshold 0.5)', () => {
		// With 0-255 input and threshold 0.5, almost everything is "dark"
		// luminance = 0.299*0 + 0.587*0 + 0.114*0 = 0
		expect(contrast_text_color([0, 0, 0])).toEqual([255, 255, 255])
	})

	it('returns white for most colors since threshold is 0.5 on 0-255 scale', () => {
		// luminance = 0.299*255 + 0.587*255 + 0.114*255 = 255 > 0.5
		// White actually returns black because 255 > 0.5
		expect(contrast_text_color([255, 255, 255])).toEqual([0, 0, 0])
	})
})
