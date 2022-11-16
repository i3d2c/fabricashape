import {fabric} from 'fabric'
import {Line} from './line'

export class Canvas extends fabric.Canvas {

    constructor(domElemendId) {
        super(domElemendId)
        this.domElemendId = domElemendId
        this.scale = {value: null, shape: null}
        this.customBackgroundImage = null
        // this._lockObjectsToBoundaries()
    }

    getImage() {
        return this.customBackgroundImage
    }

    setImage(image) {
        this.customBackgroundImage = image
    }

    setImageFromFile(imageFile) {
        const reader = new FileReader()

        reader.onload = () => {
            const img = document.createElement('img')

            img.src = reader.result

            this.customBackgroundImage = new fabric.Image(img)
            this.customBackgroundImage.scale(this.height / this.customBackgroundImage.height)
            this.add(this.customBackgroundImage)
            this.renderAll()
        };

        reader.readAsDataURL(imageFile);
    }

    lockImage() {
        this.sendToBack(this.customBackgroundImage)
        this.customBackgroundImage.hasControls = false
        this.customBackgroundImage.selectable = false
        this.customBackgroundImage.hoverCursor = 'default'
        this.discardActiveObject();
        this.renderAll()
    }

    _lockObjectsToBoundaries() {
        this.on('object:moving', function (e) {
            var obj = e.target;

            // if object is too big ignore
            if (obj.currentHeight > this.height || obj.currentWidth > this.width) {
                return;
            }
            obj.setCoords();
            // top-left  corner
            if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
            }
            // bottom-right corner
            if (obj.getBoundingRect().top + obj.getBoundingRect().height > this.height ||
                    obj.getBoundingRect().left + obj.getBoundingRect().width > this.width) {
                obj.top = Math.min(obj.top, this.height - obj.getBoundingRect().height +
                    obj.top - obj.getBoundingRect().top);
                obj.left = Math.min(obj.left, this.width - obj.getBoundingRect().width +
                    obj.left - obj.getBoundingRect().left);
            }
        });
    }

    setScale(scaleDefinition) {
        if (scaleDefinition.shape) {
            this.scale.shape = scaleDefinition.shape
        }
        if (scaleDefinition.value) {
            this.scale.value = scaleDefinition.value
        }
    }

    getScale() {
        return this.scale
    }

    lockScale() {
        this.scale.shape.hasControls = false
    }

    remove(objects) {
        console.log('biche')
        if (Array.isArray(objects)) {
            objects.forEach((object) => {
                if (object.hasOwnProperty('clear')) {
                    object.clear()
                }
            })
        } else {
            if (objects.hasOwnProperty('clear')) {
                objects.clear()
            }
        }
        this.callSuper('remove', objects)
    }

    clearScale() {
        if (this.scale.shape) {
            this.clear()
            this.remove(this.scale.shape)
        }
    }

    /**
     * Creates a line user can click on to duplicate it and use the duplicate into the scene.
     */
    createScaledLine(options) {
        const scale = (this.scale.shape.width * this.scale.shape.scaleX) / this.scale.value

        options.top = options.top * scale
        options.left = options.left * scale
        options.width = options.width * scale
        options.height = options.stroke * scale

        return new Line(options)
    }

}
