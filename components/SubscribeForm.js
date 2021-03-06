import React, { Component, PropTypes } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import Email from './email'

import { iPadMaxW } from '../lib/styles'

class SubscribeForm extends React.Component {
  static propTypes = {
    mutate: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      open: false,
      error: '',
    }
  }

  componentDidMount() {
    // when focusing on small screens, browser sets scrollTop to make sure
    // input is in view, which we don't want
    if (window.screen.height >= 768 && window.screen.width > iPadMaxW) {
      this.formEmail.textHandler.focus()
    }
  }

  onSubmit(event) {
    event.preventDefault()
    const email = this.formEmail.state.value
    this.props.mutate({ variables: { email } })
      .then(({ data }) => {
        this.formEmail.setState({ value: '' })
        this.setState({ error: '' })
        this.handleOpen()
      })
      .catch((error) => {
        this.setState({ error: error.graphQLErrors[0].data.reason })
      })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    return (
      <form
        style={{
          margin: '0 0 20px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onSubmit={this.onSubmit}
        >
        <div>
          <p>{this.state.error}</p>
        </div>
        <Email
          className="form-control"
          ref={(email) => {
            this.formEmail = email
          }}
          />
        <RaisedButton
          label="Get early access"
          primary
          style={{
            marginTop: 20,
          }}
          type="submit"
          />
        <Dialog
          title="You will hear from us soon!"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          />
      </form>
    )
  }
}

const subscribe = gql`
  mutation subscribe($email: String!) {
    subscribe(email: $email) {
      email
    }
  }
`

export default graphql(subscribe)(SubscribeForm)
