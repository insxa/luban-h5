export default {
  functional: true,
  props: {
    faIcon: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    clickFn: {
      required: false,
      type: Function
    },
    mousedownFn: {
      required: false,
      type: Function
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  render: (h, { props, listeners, slots }) => {
    const onClick = props.clickFn || function () {}
    const onMousedown = props.mousedownFn || function () {}
    return (
      <a-button
        class="shortcut-button"
        onClick={onClick}
        onMousedown={onMousedown}
        disabled={props.disabled}
      >
        <i
          class={['shortcut-icon', 'fa', `fa-${props.faIcon}`]}
          aria-hidden='true'
        />
        <span>{ props.title }</span>
      </a-button>
    )
  }
}
