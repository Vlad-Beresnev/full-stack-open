

const Notification = ({ message }) => {

    const style = {

        color: 'green',
        background: 'lightblue',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === '') {
        return (
            <div></div>
        )
    }
    
    return (
        <div style={style}>
        {message}
        </div>
    )
}

export default Notification