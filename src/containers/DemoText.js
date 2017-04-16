import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import lorem from 'lorem-ipsum'
import styled from 'styled-components'
import Text from '../components/Text'
import Pallet from '../components/Pallet'
import {getColorWithDefaultSaturation} from '../utils/colors'
import {newText, setColor} from '../actions'

const {arrayOf, shape, string, func} = PropTypes

const InlineDiv = styled.div`
  display: inline-block;
`

const DemoText = React.createClass({
  propTypes: {
    users: arrayOf(string),
    texts: arrayOf(string),
    colors: arrayOf(string),
    generateText: func,
    updateText: func,
    pallet: arrayOf(
      shape({
        name: string,
        value: string
      })
    ),
    setUserColor: func
  },
  componentDidMount () {
    this.props.generateText()
  },
  render () {
    return (
      <div>
        <div>
          {this.props.users.map((user, index) => {
            return (
              <InlineDiv key={user}>
                <Text
                  user={user}
                  text={this.props.texts[index]}
                  color={this.props.colors[index]}
                  width={450}
                  height={100}
                  onChange={this.handleChange}
                />
                <Pallet colors={this.props.pallet} scope={user} pickColor={this.props.setUserColor} />
              </InlineDiv>
            )
          })}
        </div>
        <button onClick={this.props.generateText}>Generate new text</button>
      </div>
    )
  },
  handleChange (user, e) {
    this.props.updateText({[user]: e.target.value})
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    users: Object.keys(state.text).sort(),
    texts: Object.keys(state.text).sort().map(user => state.text[user]),
    colors: Object.keys(state.colors).sort().map(user => {
      return getColorWithDefaultSaturation(state.colors[user])
    }),
    pallet: state.pallet.map(color => {
      return {
        name: color,
        value: getColorWithDefaultSaturation(color)
      }
    })
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    generateText: () => {
      dispatch(
        newText({
          user1: lorem(),
          user2: lorem()
        })
      )
    },
    updateText: text => dispatch(newText(text)),
    setUserColor: (user, color) => dispatch(setColor(user, color))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoText)
