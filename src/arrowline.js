import {fabric} from 'fabric'
import {Line} from './line'

/**
 * An Arrowline is a group that looks like a double arrowed line:
 *       <------->
 */
export const Arrowline = fabric.util.createClass(Line, {

    type: 'arrowline',

    _initComponents: function () {
        this.text = new fabric.Text(this.bodyText, {backgroundColor: 'white'})
        this.body = new fabric.Rect({fill: this.bodyFill})
        this.leftTriangle = new fabric.Triangle({fill: this.bodyFill})
        this.rightTriangle = new fabric.Triangle({fill: this.bodyFill})

        this._setComponentsPosition()

        this.components = [this.body, this.leftTriangle, this.rightTriangle, this.text]

        this._setupComponents()
        this.setText(this.bodyText)
    },

    _setComponentsPosition: function () {
        const degreesToRadiansRatio = Math.PI / 180,
            height = this.height * this.scaleY,
            width = this.width * this.scaleX,
            cosTeta = Math.cos(this.angle * degreesToRadiansRatio),
            sinTeta = Math.sin(this.angle * degreesToRadiansRatio)

        this.body.set({
            top: this.top + height * sinTeta + (height / 4) * cosTeta,
            left: this.left + height * cosTeta - (height / 4) * sinTeta,
            width: width - 2 * height,
            height: height / 2,
            angle: this.angle
        })

        this.leftTriangle.set({
            top: this.top + height * cosTeta,
            left: this.left - height * sinTeta,
            width: height,
            height: height,
            angle: this.angle - 90
        })

        this.rightTriangle.set({
            top: this.top + width * sinTeta,
            left: this.left + width * cosTeta,
            width: height,
            height: height,
            angle: this.angle + 90
        })

        const boundingRect = this.getBoundingRect(false, true)

        this.text.set({
            top: boundingRect.top + 0.5 * (boundingRect.height - this.text.height),
            left: boundingRect.left + 0.5 * (boundingRect.width - this.text.width),
            fontSize: 18
        })
    }

})

fabric.Arrowline = Arrowline

fabric.Arrowline.fromObject = function (object, callback) {
    return fabric.Object._fromObject('Arrowline', object, callback);
};
