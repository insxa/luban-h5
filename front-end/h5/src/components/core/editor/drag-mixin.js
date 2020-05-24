/*
 * @Author: ly525
 * @Date: 2020-05-17 17:21:04
 * @LastEditors: ly525
 * @LastEditTime: 2020-05-24 17:57:22
 * @FilePath: /luban-h5/front-end/h5/src/components/core/editor/drag-mixin.js
 * @Github: https://github.com/ly525/luban-h5
 * @Description: Do not edit{}
 * @Copyright 2018 - 2019 luban-h5. All Rights Reserved
 */

let dragDom = null

let dragConfig = {
  isPreDrag: false, // 准备拖拽
  isDrag: false, // 正式拖拽
  origin: {
    clientY: 0, // 鼠标按下时候时候值
    clientX: 0,
    layerX: 0, // 鼠标.x 相对于元素左上角.left 的偏移
    layerY: 0 // 鼠标.y 相对于元素左上角.top  的偏移
  }
}

class Drag {
  constructor (options) {
    this.mousedown = options.mousedown
    this.mousemove = options.mousemove
    this.mouseup = options.mouseup

    this._mousedown = this._mousedown.bind(this)
    this._mousemove = this._mousemove.bind(this)
    this._mouseup = this._mouseup.bind(this)
  }

  start (e) {
    this._mousedown(e)
  }

  _mousedown (e) {
    this.mousedown(e)
    this.toggleListener('add')
  }

  _mousemove (e) {
    console.log('mousemove')
    this.mousemove(e)
  }

  _mouseup (e) {
    console.log('mouseup')
    this.mouseup(e)
    this.toggleListener('remove')
  }

  toggleListener (action) {
    document[`${action}EventListener`]('mousemove', this._mousemove)
    document[`${action}EventListener`]('mouseup', this._mouseup)
  }
}

export default {
  data () {
    return {

    }
  },
  methods: {
    handleDragStart (element, e) {
      // https://developer.mozilla.org/zh-CN/docs/Web/API/event.button
      // 0 为 左键点击.
      if (e.button !== 0) return
      if (dragDom) {
        document.body.removeChild(dragDom)
        dragDom = null
      }
      this.dragElement = element
      dragDom = e.target.cloneNode(true)
      document.body.appendChild(dragDom)

      new Drag({
        mousedown: this.mousedown,
        mousemove: this.mousemove,
        mouseup: this.mouseup
      }).start(e)
    },
    mousedown (e) {
      // 鼠标.x 相对于元素左上角 的偏移
      const { layerX, layerY } = e
      dragConfig.origin.layerX = layerX
      dragConfig.origin.layerY = layerY
      dragConfig.origin.clientX = e.clientX
      dragConfig.origin.clientY = e.clientY

      dragDom.style.position = 'absolute'
      dragDom.style.left = e.clientX - layerX + 'px'
      dragDom.style.top = e.clientY - layerY + 'px'
      dragDom.classList.add('drag-dom', 'hidden')

      dragConfig.isPreDrag = true
    },
    /** 组件拖拽中 */
    mousemove (e) {
      const { clientX, clientY, layerX, layerY } = dragConfig.origin
      if (dragConfig.isPreDrag) {
        /** 未完成的误操作处理 */
        if (Math.abs(e.clientX - clientX) < 20 && Math.abs(e.clientY - clientY) < 20) {
          console.log('===>>')
        } else {
          dragDom.classList.remove('hidden')
          dragConfig.isPreDrag = false
          dragConfig.isDrag = true
        }
      } else if (dragConfig.isDrag) {
        dragDom.style.left = e.clientX - layerX + 'px'
        dragDom.style.top = e.clientY - layerY + 'px'
      }

      // const offsetX = this.dragConfig.startLoc.x
      // const offsetY = this.dragConfig.startLoc.y
      // console.log('dragMove')
      // // [鼠标位置.x - 鼠标相对于元素左上点的偏移.x -> [拖拽元素.x, 拖拽元素.y]
      // // this.dragConfig.endLoc.x = e.clientX - offsetX
      // // this.dragConfig.endLoc.y = e.clientY - offsetY

      // console.log(e.clientX, e.clientY, this.dragConfig.startLoc.y, this.dragConfig.startLoc.x)
      // // dragDom.style.cssText = `left: ${e.clientX - offsetX}px;top: ${e.clientY - offsetY}px`
      // dragDom.style.top = `${e.clientX - offsetX}px`
      // dragDom.style.left = `${e.clientY - offsetY}px`
      // // dragDom.style.top = this.dragConfig.endLoc.y + 'px'
      // // dragDom.style.left = this.dragConfig.endLoc.x + 'px'
      // console.log('1111')
      // this.dragConfig.insertControlSlotIndex = undefined
      // if (this.dragConfig.isPreDrag) {
      //   /** 未完成的误操作处理 */
      //   if (Math.abs(this.dragConfig.startLoc.x - e.clientX) < 10 && Math.abs(this.dragConfig.startLoc.y - e.layerY) < 10) {

      //   } else {
      //     dragDom.classList.remove('hidden')
      //     this.dragConfig.isPreDrag = false
      //     this.dragConfig.isDrag = true
      //   }
      // } else if (this.dragConfig.isDrag) {
      //   this.dragConfig.endLoc.y = e.clientY - this.dragConfig.startLoc.y
      //   this.dragConfig.endLoc.x = e.clientX - this.dragConfig.startLoc.x

      //   console.log(e.clientY, this.dragConfig.startLoc.y, this.dragConfig.endLoc.y)
      //   dragDom.style.top = this.dragConfig.endLoc.y + 'px'
      //   dragDom.style.left = this.dragConfig.endLoc.x + 'px'

      //   // TODO？
      //   let _x = this.dragConfig.endLoc.x + this.dragConfig.startLoc.x + this.canvasLocation.x
      //   let _y = this.dragConfig.endLoc.y + this.dragConfig.startLoc.y + this.canvasLocation.y

      //   let _pageX = e.pageX
      //   let _pageY = e.pageY
      //   // TODO？
      //   // if (_y > 0 && _x > 0 && _x < this.controlCanvas.formConfig.width) {
      //   if (_y > 0 && _x > 0 && _x < 320) {
      //     if (this.dragConfig.control.type === 'hidden') {
      //       this.dragConfig.isDragArea = true
      //       this.dragConfig.insertControlId = ''
      //     } else {
      //       this.dragConfig.isDragArea = true
      //       let _height = 0
      //       /** 计算应该把组件插入到什么地方 */
      //       let _currentHeight = 0
      //       let index = 0
      //       for (; index < this.panel.children.length; index++) {
      //         let _id = this.panel.children[index].id
      //         let _control = this.getControlById(_id)
      //         _height = (this.canvasPanelEl.querySelector(`[control-id=${_id}]`) /**  HTMLElement */).offsetHeight || 0

      //         if (
      //           this.dragConfig.control.type !== 'layout' &&
      //           _control.type === 'layout' &&
      //           _id !== this.dragConfig.targetFormControlId
      //         ) {
      //           if (_y >= _currentHeight - _height && _y <= _currentHeight + _height) {
      //             // 插入到子组件
      //             let _panels = Array.from(this.canvasPanelEl.querySelectorAll(`[control-id='${_control.id}'] ${_control.childrenSlot}`)) /** Array<HTMLElement> */
      //             for (let i = 0; i < _panels.length; i++) {
      //               // childrenSlot: '.van-tab__pane',
      //               let _rect = _panels[i].getBoundingClientRect()
      //               if (
      //                 _rect.top < _pageY &&
      //                 _rect.top + _rect.height > _pageY &&
      //                 _rect.left < _pageX &&
      //                 _rect.left + _rect.width > _pageX
      //               ) {
      //                 this.dragConfig.insertControlId = _control.id
      //                 this.dragConfig.insertControlSlotIndex = i
      //                 // this.controlCanvas.changeControlCursor(true, _panels[i], true)
      //                 return
      //               }
      //             }

      //             // 计算父组件下单未插入到子组件中的情况
      //             if (_y >= _currentHeight - _height / 2 && _y <= _currentHeight + _height / 2) {
      //               this.dragConfig.insertControlId = _id
      //               _currentHeight += _height
      //               break
      //             } else if (_y > _currentHeight + _height / 2 && index < this.panel.children.length - 1) {
      //               this.dragConfig.insertControlId = this.panel.children[index + 1].id
      //             }
      //           }
      //         } else {
      //           if (_y >= _currentHeight - _height / 2 && _y <= _currentHeight + _height / 2) {
      //             this.dragConfig.insertControlId = _id
      //             _currentHeight += _height
      //             break
      //           } else if (_y > _currentHeight + _height / 2 && index < this.panel.children.length - 1) {
      //             this.dragConfig.insertControlId = this.panel.children[index + 1].id
      //           }
      //         }
      //         _currentHeight += _height
      //       }
      //       if (_y >= _currentHeight - _height / 2 && index == this.panel.children.length) {
      //         this.dragConfig.insertControlId = ''
      //         // this.controlCanvas.changeControlCursor(true)
      //       } else {
      //         if (this.dragConfig.insertControlId) {
      //           // this.controlCanvas.changeControlCursor(true, this.controlCanvas.getFormControlElementById(this.dragConfig.insertControlId))
      //         } else {
      //           console.error('insertControlId出错')
      //         }
      //       }
      //     }
      //   } else {
      //     this.dragConfig.isDragArea = false
      //     // this.controlCanvas.changeControlCursor(false)
      //   }
      // }
    },
    mouseup (e) {
      const { layerX, layerY } = dragConfig.origin
      document.body.removeChild(dragDom)
      dragDom = null

      const canvasWrapper = document.querySelector('.canvas-wrapper')
      const position = canvasWrapper.getBoundingClientRect()
      this.dragElement && this.clone({
        ...this.dragElement,
        customStyle: {
          left: e.clientX - layerX - position.left,
          top: e.clientY - layerY - position.top
        }
      })
      // document.removeEventListener('mousemove', this.mousemove)
      // document.removeEventListener('mouseup', this.mouseup)
      // if (this.dragConfig.isDrag || this.dragConfig.isPreDrag) {
      //   document.body.removeChild(dragDom)
      //   dragDom = null

      //   /** 放置控件 */
      //   if (this.dragConfig.isDragArea) {
      //     let _newControl /** FormDesign.FormControl */ = cloneForce({
      //       ...this.componentList.find(i => i.name == this.dragConfig.control.name),
      //       height: 0
      //     })

      //     // 新控件和老控件以不同方式处理Id
      //     if (!this.dragConfig.targetFormControlId) {
      //       _newControl.id = this.$common.createModelId(10)
      //     } else {
      //       _newControl.id = this.dragConfig.targetFormControlId
      //     }
      //     _newControl.control.attrs.id = _newControl.id
      //     // TODO? remark?
      //     _newControl.control.attrs.remark = (_newControl.autoPrefix || '') + this.formConfig.controlIndex++
      //     // 获取插入索引
      //     let _insertIndex = this.dragConfig.insertControlId ? this.panel.children.findIndex(i => i.id == this.dragConfig.insertControlId) : this.panel.children.length

      //     if (this.dragConfig.targetFormControlId) {
      //       debugger
      //       // 插入到某个控件中处理方式
      //       if (this.dragConfig.targetFormControlId != this.dragConfig.insertControlId) {
      //         this.panel.children = this.$common.moveNodeOfTree(
      //           this.panel.children,
      //           this.dragConfig.targetFormControlId,
      //           this.dragConfig.insertControlId,
      //           this.dragConfig.insertControlSlotIndex
      //         )
      //       }
      //     } else {
      //       // 刚刚插入界面或添加到最后处理方式
      //       // if (this.dragConfig.insertControlSlotIndex !== undefined) {
      //       //     ((this.panel.children.find(i => i.id == this.dragConfig.insertControlId) as FormDesign.FormControl).children as Array<Array<FormDesign.FormControl>>)[this.dragConfig.insertControlSlotIndex].splice(_insertIndex, 0, _newControl);
      //       // } else {
      //       //     this.panel.children.splice(_insertIndex, 0, _newControl);
      //       // }
      //       this.controlList.push(_newControl)
      //     }

      //     this.$nextTick(() => {
      //       if (_newControl.type == 'hidden') {
      //         this.changeSelectedFormControl([ _newControl ])
      //       }
      //     })
      //   }

      //   this.dragConfig = {
      //     control: null,
      //     insertControlId: '',
      //     insertControlSlotIndex: undefined,
      //     targetFormControlId: '',
      //     isDrag: false,
      //     isPreDrag: false,
      //     isDragArea: false,
      //     startLoc: { x: 0, y: 0 },
      //     endLoc: { x: 0, y: 0 }
      //   }
      //   this.dragFormControlId = ''
      //   this.controlCanvas.changeControlCursor(false)

      //   this.$nextTick(() => {
      //     this.controlCanvas.refresh()
      //     this.refreshControlTools()
      //   })
      // }
    }
  },
  updated () {
    console.log('updated')
  }
}
