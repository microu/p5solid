/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import AppSegmentSamples from './app/AppSegmentSamples'

const root = document.getElementById('root')

render(() => <AppSegmentSamples />, root!)
