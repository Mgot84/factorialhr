type TModalFooterProps = Omit<
  TModalProps,
  "headerText" | "children" | "isVisible"
>;

const TModalFooter = ({
  customAction,
  showCancel = true,
  onConfirm,
  disableConfirm = false,
  hide,
}: TModalFooterProps) => {
  const isMobileLarge = useMediaQuery({ query: "(min-width: 425px)" });
  const buttonSize = isMobileLarge ? ButtonSize.large : ButtonSize.block;

  return (
    <div className={style.footer} data-testid="tinki-modal-footer">
      {showCancel && (
        <TButton
          label="Cancel"
          buttonStyle={ButtonStyle.secondary}
          size={isMobileLarge ? ButtonSize.large : ButtonSize.block}
          onClick={hide}
        />
      )}
      {customAction ? (
        customAction.map((a) => {
          return (
            <TButton
              key={`customAction-${a.label}`}
              label={a.label}
              size={buttonSize}
              onClick={a.onClick}
              buttonStyle={a.style || ButtonStyle.primary}
              disabled={a.disabled}
            />
          );
        })
      ) : (
        <TButton
          label="Accept"
          size={buttonSize}
          onClick={onConfirm}
          disabled={disableConfirm}
        />
      )}
    </div>
  );
};

export default TModalFooter;
