export default function Modal() {
  const renderModalHeading = () => {
    return (
      <div className={'modal__heading'}>
        <div className={'modal__title'}>

        </div>
        <div className={'modal__close-anchor'}>
          X
        </div>
      </div>
    )
  }

  const renderModalBody = () => {
    return (
      <div>

      </div>
    )
  }

  const renderModalControls = () => {
    return (
      <div>

      </div>
    )
  }

  return (
    <div className={'modal__mask'}>
      <div className={'modal__container'}>
        {renderModalHeading()}
        {renderModalBody()}
        {renderModalControls()}
      </div>
    </div>
  )
}