import {fabric} from 'fabric'
import {assert} from 'chai'

import {Canvas} from '../lib/fabricashape.js'

describe('Canvas', () => {

    describe('constructor', () => {
        it('Should save the given domElemendId.', () => {
            const c = new Canvas('myId')

            assert.equal(c.domElemendId, 'myId')
        });
    });

    describe('setScale', () => {
        it('Should set given shape and given scale value as scale.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            const shape = new fabric.Rect({width: 10, height: 10})
            const value = 13.89
        
            // Act
            canvas.setScale({shape, value})
        
            // Assert
            assert.equal(canvas.scale.shape, shape)
            assert.equal(canvas.scale.value, value)
        });

        it('Should set only shape if no value is given.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            const shape = new fabric.Object()
        
            // Act
            canvas.setScale({shape})
        
            // Assert
            assert.equal(canvas.scale.shape, shape)
            assert.equal(canvas.scale.value, null)
        });

        it('Should set only value if no shape is given.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            const value = 13.89
        
            // Act
            canvas.setScale({value})
        
            // Assert
            assert.equal(canvas.scale.shape, null)
            assert.equal(canvas.scale.value, value)
        });
    });

    describe('lockScale', () => {
        it('Should set scale shape hasControls attribute to false.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            const shape = new fabric.Object()
            const value = 13.89
        
            // Act
            canvas.setScale({shape, value})
            canvas.lockScale()
        
            // Assert
            assert.isFalse(canvas.scale.shape.hasControls)
        });
    });

    describe('addScale', () => {
        it('Should add a new Arrowline to the canvas with given text.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            const value = 13.89
        
            // Act
            canvas.addScale(value)
        
            // Assert
            assert.equal(canvas.scale.shape.type, 'arrowline')
            assert.equal(canvas.scale.value, value)
        });

        it('Should throw exception if a scale shape already exists.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
        
            // Act
            canvas.addScale(1)

            // Assert
            assert.throws(() => {canvas.addScale(1)}, ReferenceError, 'Scale has already been set.');
        });
    });

    describe('onScaleChange', () => {
        describe.only('shape', () => {
            it('Should update all lines width.', () => {
                // Arrange
                const canvas = new Canvas('example2D')
                canvas.addScale(10)
                const line = canvas.addLine({mTop: 0, mLeft: 0, mStroke: 10, mWidth: 2})

                // Act
                canvas.getScale().shape.scaleToWidth(canvas.getScale().shape.width * 2)
                canvas.getScale().shape.fire('scaling')

                // Assert
                assert.equal(line.height, 400)
            });
        });

        describe.only('value', () => {
            it('Should update all lines width.', () => {
                // Arrange
                const canvas = new Canvas('example2D')
                canvas.addScale(10)
                const line = canvas.addLine({mTop: 0, mLeft: 0, mStroke: 10, mWidth: 2})

                // Act
                canvas.setScale({value: canvas.getScale().value * 2})

                // Assert
                assert.equal(line.height, 100)
            });

            it('Should update scale text.', () => {
                // Arrange
                const canvas = new Canvas('example2D')
                canvas.addScale(10)

                // Act
                canvas.setScale({value: 30})

                // Assert
                assert.equal(canvas.getScale().shape.text.text, '30m')
            });
        });
    });

    describe('addLine', () => {
        it('Should add a line to the canvas.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            canvas.addScale(1)
        
            // Act
            canvas.addLine({mTop: 0, mLeft: 0, mWidth: 1, mStroke: 1})
        
            // Assert
            assert.equal(canvas.size(), 5+3) // 5=scale shape, 3=line(body, text & group)
        });

        it('Should return the created line.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            canvas.addScale(1)
        
            // Act
            const result = canvas.addLine({mTop: 0, mLeft: 0, mWidth: 1, mStroke: 1})
        
            // Assert
            assert.equal(result.type, 'line')
        });

        it('Should add multiple lines too.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            canvas.addScale(1)
        
            // Act
            canvas.addLine({mTop: 0, mLeft: 0, mWidth: 1, mStroke: 1})
            canvas.addLine({mTop: 0, mLeft: 0, mWidth: 1, mStroke: 1})
            canvas.addLine({mTop: 0, mLeft: 0, mWidth: 1, mStroke: 1})
        
            // Assert
            assert.equal(canvas.size(), 5+3*3) // 5=scale shape, 3=line(body, text & group)
        });

        it('Should throw exception if scale is not set.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
        
            // Act
            // Assert
            assert.throws(() => {canvas.addLine()}, ReferenceError, 'Scale has not been set.');
        });
    });

    describe('setImage', () => {
        it('Should set image of the instance to given instance.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
            const obj = new fabric.Object()
        
            // Act
            canvas.setImage(obj)
        
            // Assert
            assert.equal(canvas.getImage(), obj)
        });
    });

    describe('lockImage', () => {
        it('Should set image hasControls attribute to false.', () => {
            // Arrange
            const c = new Canvas('example2D')
            const obj = new fabric.Object()
            c.setImage(obj)
        
            // Act
            c.lockImage()
        
            // Assert
            assert.isFalse(c.customBackgroundImage.hasControls)
        });
    });

    describe('createScaledLine', () => {
        it('Should create a line with dimensions calculated from scale.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
        
            // Act
            const shape = new fabric.Rect({width: 10, height: 10})
            const value = 12.5
            canvas.setScale({shape, value})
            const createdLine = canvas.createScaledLine({mTop: 1, mLeft: 2, mWidth: 3, mStroke: 0.4})
        
            // Assert
            const scale = 10 / 12.5 // shape.width / scale value
            assert.equal(createdLine.top, 1 * scale, "top is not ok")
            assert.equal(createdLine.left, 2 * scale, "left is not ok")
            assert.equal(createdLine.width, 3 * scale, "width is not ok")
            assert.equal(createdLine.height, 0.4 * scale, "height is not ok")
        });

        it('Should take scale shape transformations in account.', () => {
            // Arrange
            const canvas = new Canvas('example2D')
        
            // Act
            const shape = new fabric.Rect({width: 10, height: 10})
            shape.scaleX = 3
            const value = 12.5
            canvas.setScale({shape, value})
            const createdLine = canvas.createScaledLine({mTop: 1, mLeft: 2, mWidth: 3, mStroke: 0.4})
        
            // Assert
            const scale = (3 * 10) / 12.5 // shape.width / scale value
            assert.equal(createdLine.top, 1 * scale, "top is not ok")
            assert.equal(createdLine.left, 2 * scale, "left is not ok")
            assert.equal(createdLine.width, 3 * scale, "width is not ok")
            assert.equal(createdLine.height, 0.4 * scale, "height is not ok")

        });
    });

});
