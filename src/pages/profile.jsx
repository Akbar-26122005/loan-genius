import React, { useEffect, useState, useContext } from "react"
import { UNSAFE_useFogOFWarDiscovery, useNavigate } from "react-router-dom"
import { showMessage } from "../components/messages"
import getPath from "../config/serverClient"
import { UserContext } from "../config/userContext"
import back_icon from '../images/back_icon.svg'
import '../styles/profile.css'

export default function Profile() {
    const { user, setUser, setLoading } = useContext(UserContext)
    const [reload, setReload] = useState(false)
    const [isMenuShow, setIsMenuShow] = useState(false)
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [userDataChanged, setUserDataChanged] = useState(false)
    
    const [passport, setPassport] = useState(user.passports)
    const [series, setSeries] = useState('')
    const [number, setNumber] = useState('')
    const [issuedBy, setIssuedBy] = useState('')
    const [issueDate, setIssueDate] = useState('')
    const [divisionCode, setDivisionCode] = useState('')
    const [registrationAddress, setRegistrationAddress] = useState('')
    const [passportDataChanged, setPassportDataChanged] = useState(false)

    useEffect(() => {
        handleCancelUserData()
        handleCancelPassportData()
    }, [user, passport])

    useEffect(() => {
        setUserDataChanged(
            user.email !== email
            || user.phone_number !== phoneNumber
            || user.first_name !== firstName
            || user.last_name !== lastName
            || user.middle_name !== middleName
        )
    }, [email, phoneNumber, firstName, lastName, middleName])

    useEffect(() => {
        const condition = (
            series.length === 4
            && number.length === 6
            && issuedBy.length > 0
            && issueDate
            && divisionCode.length === 6
            && registrationAddress.length > 0
        )

        if (!passport) {
            setPassportDataChanged(condition)
        } else {
            setPassportDataChanged(
                (passport.series !== series
                || passport.number !== number
                || passport.issued_by !== issuedBy
                || passport.issue_date !== issueDate
                || passport.division_code !== divisionCode
                || passport.registration_address !== registrationAddress)
                & condition
            )
        }
    }, [series, number, issuedBy, issueDate, divisionCode, registrationAddress])

    useEffect(() => {
        if (!passport) return
        setSeries(passport.series)
        setNumber(passport.number)
        setIssuedBy(passport.issued_by)
        setIssueDate(passport.issue_date)
        setDivisionCode(passport.division_code)
        setRegistrationAddress(passport.registration_address)
    }, [passport])

    const handleCancelUserData = () => {
        setEmail(user.email)
        setPhoneNumber(user.phone_number)
        setFirstName(user.first_name)
        setLastName(user.last_name)
        setMiddleName(user.middle_name)
    }

    const handleCancelPassportData = () => {
        if (passport) {
            setSeries(passport.series);
            setNumber(passport.number);
            setIssuedBy(passport.issued_by);
            setIssueDate(passport.issue_date); // исправлено
            setDivisionCode(passport.division_code);
            setRegistrationAddress(passport.registration_address);
        } else {
            setSeries('');
            setNumber('');
            setIssuedBy('');
            setIssueDate('');
            setDivisionCode('');
            setRegistrationAddress('');
        }
    };

    const handleSaveUserData = async () => {
        if (!userDataChanged) return
        try {
            const response = await fetch(getPath('/auth/update'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    id: user.id
                    ,email: email
                    ,phone_number: phoneNumber
                    ,first_name: firstName
                    ,last_name: lastName
                    ,middle_name: middleName
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)

            setUser(data.user)
            setReload(prev => !prev)
            window.location.reload()
        } catch (err) {
            showMessage(err.message, 'error-message')
        }
    }

    // Create the new passport row
    const handleCreatePassportData = async () => {
        if (!passportDataChanged) return
        try {
            const response = await fetch(getPath('/passport/create'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    user_id: user.id
                    ,series: series
                    ,number: number
                    ,issued_by: issuedBy
                    ,issue_date: issueDate
                    ,division_code: divisionCode
                    ,registration_address: registrationAddress
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)

            setPassport(data.passport)
            setReload(prev => !prev)
            window.location.reload()
        } catch (err) {
            showMessage(err.message, 'error-message')
        }
    }

    const handleSavePassportData = async () => {
        if (!passportDataChanged) return
        try {
            const response = await fetch(getPath('/passport/update'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    id: passport.id
                    ,user_id: passport.user_id
                    ,series
                    ,number
                    ,issued_by: issuedBy
                    ,issue_date: issueDate
                    ,division_code: divisionCode
                    ,registration_address: registrationAddress
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)

            setPassport(data.passport)
            setReload(prev => !prev)
            window.location.reload()
        } catch (err) {
            showMessage(err.message, 'error-message')
        }
    }

    return (
        <div className="Profile">
            <h1>User profile</h1>
            <div className="columns">
                <div className="rows no-copy user"> {/* User data */}
                    <h2>User data</h2>
                    <div className="row"> {/* Email */}
                        <label>Email</label>
                        <input required
                            type="text"
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                        />
                    </div>
                    <div className="row"> {/* Phone number */}
                        <label>Phone number</label>
                        <input required
                            type="text"
                            value={ phoneNumber }
                            onChange={ e => setPhoneNumber(e.target.value) }
                        />
                    </div>
                    <div className="row"> {/* First name */}
                        <label>First name</label>
                        <input required
                            type="text"
                            value={ firstName }
                            onChange={ e => setFirstName(e.target.value) }
                        />
                    </div>
                    <div className="row"> {/* Last name */}
                        <label>Last name</label>
                        <input required
                            type="text"
                            value={ lastName }
                            onChange={ e => setLastName(e.target.value) }
                        />
                    </div>
                    <div className="row"> {/* Middle name */}
                        <label>Middle name</label>
                        <input
                            type="text"
                            value={ middleName }
                            onChange={ e => setMiddleName(e.target.value) }
                        />
                    </div>
                    <div className="tools">
                        <div
                            className={ `tool cancel ${ userDataChanged && 'active' }` }
                            onClick={ handleCancelUserData }
                        > Cancel </div>
                        <div
                            className={ `tool save ${ userDataChanged && 'active' }` }
                            onClick={ handleSaveUserData }
                        > Save </div>
                    </div>
                </div>

                <div className="rows no-copy passport end"> {/* Passport data */}
                    <h2>Passport data{ !passport && '*' }</h2>
                    <div className="row no-copy"> {/* Series */}
                        <label>Series</label>
                        <input required
                            type="number"
                            value={ series }
                            onChange={ e => e.target.value.length <= 4 && setSeries(e.target.value) }
                            maxLength={ 4 }
                        />
                    </div>
                    <div className="row no-copy"> {/* Number */}
                        <label>Number</label>
                        <input required
                            type="number"
                            value={ number }
                            onChange={ e => e.target.value.length <= 6 && setNumber(e.target.value) }
                            maxLength={ 4 }
                        />
                    </div>
                    <div className="row no-copy"> {/* Issued by */}
                        <label>Issued by</label>
                        <input required
                            type="text"
                            value={ issuedBy }
                            onChange={ e => setIssuedBy(e.target.value) }
                        />
                    </div>
                    <div className="row no-copy"> {/* Issue date */}
                        <label>Issue date</label>
                        <input required
                            type="date"
                            value={ issueDate }
                            onChange={ e => setIssueDate(e.target.value) }
                        />
                    </div>
                    <div className="row no-copy"> {/* Division code */}
                        <label>Division code</label>
                        <input required
                            type="text"
                            value={ divisionCode }
                            onChange={ e => e.target.value.length <= 6 && setDivisionCode(e.target.value) }
                            maxLength={ 6 }
                            minLength={ 6 }
                        />
                    </div>
                    <div className="row no-copy"> {/* Registration address */}
                        <label>Registration address</label>
                        <input required
                            type="text"
                            value={ registrationAddress }
                            onChange={ e => setRegistrationAddress(e.target.value) }
                        />
                    </div>
                    <div className="tools">
                        <div
                            className={ `tool cancel ${ passportDataChanged && 'active' }` }
                            onClick={ handleCancelPassportData }
                        > Cancel </div>
                        {passport
                        ? <div
                            className={ `tool save ${ passportDataChanged && 'active' }` }
                            onClick={ handleSavePassportData }
                        > Save </div>
                        : <div
                            className={ `tool create ${ passportDataChanged && 'active' }` }
                            onClick={ handleCreatePassportData }
                        > Create </div>
                        }
                    </div>
                </div>
            </div>
            <BackButton onClick={ () => window.history.back() } />
        </div>
    )
}

function BackButton({ onClick }) {
    return (
        <div
            className="BackButton"
            onClick={ onClick }
        >
            <img
                src={ back_icon }
                alt="back"
            />
        </div>
    )
}