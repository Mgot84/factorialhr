/* This is a code I made some time ago. What I am proud of this code is about OnlyOneOfProps generic mapped constraint */
/* OnlyOneOfProps allows to check if one of the props in the second argument of the generic
exists, then the other must not exist */
/* This is usefull here because if the action on accept is the default action, onConfirm must be used.
if we want to use multiple actions in array, then onConfirm prop should exist and customAction prop must exist */
/* Another thing I want to show from this code is that I usually extract all logic to separate hooks 
here 'useMediaQuery' so the component doesn't grow too much and it is easier to understand */

/* One thing I don't like now about this code is that I rather would implement two separate components,
  let's call CustomTModal for customActions, and DefaultTModal for the default onConfirmAction.
  /* I dislike components passing two many props, because it is a symptom that it grew
  to be reused in multiple cases, and in my opinion is better to separate cases in different components
  so we don't pass props that component doesn't need.*/

/*instead of having one TModal component which accepts two kind of footers*/

type OnlyOneOfProps<T, U extends keyof T> = T &
  {
    [K in U]: Omit<T, K> & { [P in K]?: undefined };
  }[U];

/* I try t explain this generic type step by step:
  
 Lets imagine our props interface is {customAction:()=>void, onConfirm:()=>void, other:string } 
and OnlyOneOfProps<props,"customAction" | "onConfirm">

U is "customAction" | "onConfirm"
[K in U] is a way to make key K go over all U keys.
K is 'customAction'=> Omit<props,customAction> is {onConfirm:()=>void,other:string}
[P in K] is a way to make key P go over all K keys. in this case, [P in K] will
be always simply K.So:
[P in customAction] is => {customAction?: undefined}
So intersection & is => {customAction?:undefined, onConfirm:()=>void,other:string}

U is onConfirm=>Omit<props,onConfirm> is {customAction:()=>void,other:string}
[P in onConfirm] is =>{onConfirm?:undefined}
So intersection & is=>{customAction:()=>void, onConfirm?:()=>void,other:string}

The object becomes:
When K is customAction=>{customAction:{customAction?:undefined, b:number,other:string}}
When k is onConfirm=>{onConfirm:{customAction:()=>void, b?:undefined,c:string}}
And using the [U] next to our object. Which is ['customAction'|'onConfirm'],
we get the union type of the value of the key 'customAction' and the value of the key 'onConfirm'
which is:{customAction?:undefined, onConfirm:()=>void,other:string} | {customAction:()=>void, onConfirm?:undefined,other:string}

Conclusion:
'customAction' exists as a prop then onConfirm must not be set in the component as a prop.
And when 'onConfirm' exists as  aprop, then 'customAction' must not be set in the component as a prop.

  */

const TModal = ({
  headerText,
  children,
  isVisible,
  customAction,
  wideScreen,
  hide,
  onConfirm,
  disableConfirm = false,
  showCancel = true,
  hideOnBlur = false,
  className = "",
  centered = false,
  showButtons = true,
  ...rest
}: OnlyOneOfProps<TModalProps, "customAction" | "onConfirm"> &
  Record<string, unknown>): JSX.Element => {
  const isMobileLarge = useMediaQuery({ query: "(min-width: 425px)" });
  const tModalContainerStyles = clsx({
    [style.container]: true,
    [style.show]: isVisible,
    [style.wideScreen]: wideScreen,
    [style.mobile]: !isMobileLarge,
    [className]: className,
    [style.centered]: centered,
  });
  const tModalStyles = clsx({
    [style.modal]: true,
  });
  const closeButtonStyles = clsx({
    [style["widescreen-button"]]: wideScreen,
  });

  const modalRef = useHideOnBlur(isVisible, hideOnBlur, hide);

  return (
    <div className={tModalContainerStyles} {...rest}>
      <div className={style.modal} ref={modalRef}>
        <div className={style.header}>
          <h4 className={style.title}>{headerText}</h4>
          <TButton
            buttonStyle={ButtonStyle.ghost}
            icon={Icons.CloseIcon}
            onClick={hide}
            className={closeButtonStyles}
          />
        </div>
        <div className={style.body}>{children}</div>
        {showButtons && (
          <TModalFooter
            hide={hide}
            customAction={customAction}
            showCancel={showCancel}
            onConfirm={onConfirm}
            disableConfirm={disableConfirm}
          />
        )}
      </div>
    </div>
  );
};
export default TModal;
