import {fabric} from 'fabric'
import {assert} from 'chai'

import {Canvas, Line, Constants} from '../lib/fabricashape.js'


describe('Line', () => {

    let canvas, line, lineComponents

    beforeEach(() => {
        canvas = new Canvas('myId')
        line = new Line({mTop: 1, mLeft: 2, mWidth: 3, mStroke: 4, angle: 5})
    })

    describe('constructor', () => {
        it('Should set type to "line".', () => {
            // Arrange
            // Act
            // Assert
            assert.equal(line.type, 'line')
        });

        it('Should save metric values in instance.', () => {
            // Arrange
            // Act
            // Assert
            assert.equal(line.mTop, 1)
            assert.equal(line.mLeft, 2)
            assert.equal(line.mWidth, 3)
            assert.equal(line.mStroke, 4)
        });

        it('Should set fill of main line to transparent.', () => {
            // Arrange
            // Act
            // Assert
            assert.equal(line.fill, 'transparent')
        });

        it('Should set hasControls to true.', () => {
            // Arrange
            // Act
            // Assert
            assert.isTrue(line.hasControls)
        });

        it('Should disable any control in Constants.RECT_DISABLED_CONTROLS.', () => {
            // Arrange
            // Act
            // Assert
            Constants.RECT_DISABLED_CONTROLS.forEach((control) => {
                assert.isFalse(line.isControlVisible(control), `Control ${control} is visible while it shouldn't.`)
            })
        });

        it('Should rescale body to equal main line.', () => {
            // Arrange

            // Act
            canvas.add(line)
            line.scale(12)
            line.fire('scaling')

            // Assert
            assert.equal(line.body.scaleX, 1)
            assert.equal(line.body.scaleY, 1)
            assert.equal(line.scaleY, 12, "scaleY")
            assert.equal(line.body.top, line.top, "top")
            assert.equal(line.body.left, line.left, "left")
            assert.equal(line.body.height, line.height * line.scaleY, "height")
            assert.equal(line.body.width, line.width * line.scaleX, "width")
            assert.equal(line.body.angle, line.angle, "angle")
        });

        it('Should set body fill to given fill.', () => {
            // Arrange
            const expectedFill = "blue"
        
            // Act
            line = new Line({fill: expectedFill})
            canvas.add(line)
        
            // Assert
            assert.equal(line.body.fill, expectedFill)
        });

        it('Should set text to given text.', () => {
            // Arrange
            const expectedText = "12m"
        
            // Act
            line = new Line({text: expectedText})
            canvas.add(line)
        
            // Assert
            assert.equal(line.text.text, expectedText)
        });

        it('Should be working with serialize/deserialize.', () => {
            // Arrange
            line = new Line({})
            canvas.add(line)
            const expectedJSON = canvas.toJSON()
        
            // Act
            canvas = new Canvas('myId')
            canvas.loadFromJSON(expectedJSON)
            const result = canvas.toJSON()
        
            // Assert
            assert.deepEqual(result, expectedJSON)
        });
    });

    describe('getComponents', () => {
        it('Should return components of the line.', () => {
            // Arrange
            // Act
            canvas.add(line)
            lineComponents = line.getComponents()

            // Assert
            assert.equal(lineComponents.length, 2)
            assert.equal(lineComponents[0].type, 'text')
            assert.equal(lineComponents[1].type, 'rect')
        });
    });

    describe('setText', () => {
        it('Should change component text.', () => {
            // Arrange
            const expectedText = "12.4m"
        
            // Act
            canvas.add(line)
            line.setText(expectedText)
        
            // Assert
            assert.equal(line.getComponents()[0].text, expectedText)
        });

        it('Should add "m" at the end if not already set.', () => {
            // Arrange
            const expectedText = "12.4m"
        
            // Act
            canvas.add(line)
            line.setText("12.4")
        
            // Assert
            assert.equal(line.getComponents()[0].text, expectedText)
        });

        it('Should set bodyText of the line.', () => {
            // Arrange
            const expectedText = "12.4m"
        
            // Act
            canvas.add(line)
            line.setText(expectedText)
        
            // Assert
            assert.equal(line.bodyText, expectedText)
        });
    });

});
