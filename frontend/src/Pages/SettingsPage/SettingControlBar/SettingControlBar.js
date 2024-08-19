import s from "./SettingControlBarStyle.module.css"
import { useAuthContext } from "../../../Hooks/useAuthContext";

const SettingControlBar = ({settingName, settingHandler}) => {
    const {user} = useAuthContext();
    const {
        setCurrent,
        setCurrentConfirm,
        isChanging,
        setIsChanging,
        setIsWrong,
        handleCancel,
        onConfirm,
        message,
        setMessage
    } = settingHandler;

    const handleChangeClick = () =>{
        setMessage({status: null, message: ""});
        setCurrent("");
        if (settingName === "Password") { setCurrentConfirm(""); }
        setIsChanging(true);
        setIsWrong(false);
    };

    return (
        <div className={s.control_bar}>
            <small className={`${s.control_bar_message} ${message.status === null ? undefined : message.status === true ? s.successful : s.failed}`}>{message.message}</small>
            <div className={s.control_bar_buttons_container}>
                {!isChanging ? (
                    <button onClick={handleChangeClick}>
                        Change {settingName}
                    </button>
                ) : 
                (<>
                    <button onClick={handleCancel}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}>
                        Confirm
                    </button>
                </>)}
            </div>
            
        </div>
    )
}

export default SettingControlBar;