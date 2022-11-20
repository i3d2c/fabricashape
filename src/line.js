import {fabric} from 'fabric'
import {Constants} from './constants'

export const Line = fabric.util.createClass(fabric.Rect, {

    type: 'line',
    components: [],
    hasControls: true,

    initialize: function (options) {
        options || (options = { });
        this.callSuper('initialize', options);

        this.bodyFill = options.fill || ''
        if (options.hasOwnProperty('bodyFill')) {
            this.bodyFill = options.bodyFill
        }
        this.bodyText = options.text || ''
        if (options.hasOwnProperty('bodyText')) {
            this.bodyText = options.bodyText
        }
        Constants.RECT_DISABLED_CONTROLS.forEach((control) => {
            this.setControlVisible(control, false)
        })
        this.set('fill', 'transparent')

        this.on(
            {
                'added': this._initComponents,
                'modified': this._setComponentsPosition,
                'scaling': this._setComponentsPosition,
                'moving': this._setComponentsPosition,
                'rotating': this._setComponentsPosition
            }
        )
    },

    _initComponents: function () {
        this.text = new fabric.Text('', {visible: false})
        this.body = new fabric.Rect({
            width: this.width,
            height: this.height,
            top: this.top,
            left: this.left,
            fill: this.bodyFill
        })
        this.components = [this.text, this.body]

        this._setupComponents()
        this.setText(this.bodyText)
    },

    /**
     * _setupComponents: add the component to the canvas and set some options
     * to avoid them from being exported/selected
     */
    _setupComponents: function () {
        this.components.forEach((component) => {
            component.set({
                excludeFromExport: true,
                hasControls: false,
                selectable: false
            })
            this.canvas.add(component)
            component.sendBackwards()
        })
    },

    _setComponentsPosition: function () {
        const height = this.height * this.scaleY,
            width = this.width * this.scaleX,
            boundingRect = this.getBoundingRect()

        if (this.text) {
            this.text.set({
                top: boundingRect.top + 0.5 * (boundingRect.height - this.text.height),
                left: boundingRect.left + 0.5 * (boundingRect.width - this.text.width)
            })
        }

        this.body.set({
            top: this.top,
            left: this.left,
            width: width,
            height: height,
            angle: this.angle
        })

    },

    getComponents: function () {
        return this.components
    },

    setText: function (text) {
        this.bodyText = text
        if (text.slice(-1) !== 'm') {
            text += 'm'
        }
        this.text.set({
            text: text
        })
        this._setComponentsPosition()
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx)
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            bodyFill: this.get('bodyFill'),
            bodyText: this.get('bodyText')
        });
    }

})

fabric.Line = Line

fabric.Line.fromObject = function (object, callback) {
    return fabric.Object._fromObject('Line', object, callback);
};
