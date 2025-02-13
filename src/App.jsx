import { useEffect, useRef } from 'react'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const App = () => {
	const thisRef = useRef({})

	useEffect(() => {
		const currentRef = thisRef.current
		currentRef.sceneSetup()
		currentRef.addLights()
		currentRef.loadTheModel()
		currentRef.startAnimationLoop()
		window.addEventListener('resize', currentRef.handleWindowResize)
		return () => {
			window.removeEventListener('resize', currentRef.handleWindowResize)
			window.cancelAnimationFrame(currentRef.requestID)
			currentRef.controls.dispose()
			document.body.removeChild(currentRef.renderer.domElement)
		}
	}, [])

	thisRef.current.sceneSetup = () => {
		const canvas = document.createElement('canvas')
		document.getElementById('root').appendChild(canvas)

		thisRef.current.scene = new THREE.Scene()
		thisRef.current.camera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)

		thisRef.current.camera.position.set(-300, 150, 100)
		thisRef.current.camera.rotation.y = Math.PI / 8

		thisRef.current.renderer = new THREE.WebGLRenderer({ canvas })
		thisRef.current.renderer.setSize(window.innerWidth, window.innerHeight)

		thisRef.current.controls = new OrbitControls(thisRef.current.camera, canvas)
	}

	thisRef.current.loadTheModel = () => {
		const objLoader = new OBJLoader()
		objLoader.load(
			'heart.obj',
			object => {
				thisRef.current.scene.add(object)
				let hexColor = (250 << 16) | (100 << 8) | 120
				object.traverse(child => {
					if (child.isMesh) {
						child.material.color.set(hexColor)
					}
				})
				thisRef.current.model = object
			},
			null
		)
	}

	thisRef.current.addLights = () => {
		const lights = []
		lights[0] = new THREE.PointLight(0xffffff, 1, 0)
		lights[1] = new THREE.PointLight(0xffffff, 1, 0)
		lights[2] = new THREE.PointLight(0xffffff, 1, 0)
		lights[0].position.set(0, 2000, 0)
		lights[1].position.set(1000, 2000, 1000)
		lights[2].position.set(-1000, -2000, -1000)
		thisRef.current.scene.add(lights[0])
		thisRef.current.scene.add(lights[1])
		thisRef.current.scene.add(lights[2])
	}

	thisRef.current.startAnimationLoop = () => {
		if (thisRef.current.model) thisRef.current.model.rotation.y += 0.005
		thisRef.current.renderer.render(
			thisRef.current.scene,
			thisRef.current.camera
		)
		thisRef.current.requestID = window.requestAnimationFrame(
			thisRef.current.startAnimationLoop
		)
	}

	thisRef.current.handleWindowResize = () => {
		thisRef.current.renderer.setSize(window.innerWidth, window.innerHeight)
		thisRef.current.camera.aspect = window.innerWidth / window.innerHeight
		thisRef.current.camera.updateProjectionMatrix()
	}

	return null
}

export default App
