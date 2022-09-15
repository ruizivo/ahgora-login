import { React, useState, useEffect } from 'react'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import AhgoraService from '../../service/ahgoraService'

import './resume.css'
import Clock from '../clock/clock'

const createWorker = createWorkerFactory(() =>
  import('../../worker/ahgoraWorker')
)

function Resume (props) {
  const [selectDay, setSelectDay] = useState(null)
  const [mirrorDayInfo, setMirrorDayInfo] = useState(null)
  const [mirrorMonthInfo, setMirrorMonthInfo] = useState(null)
  const [registerInProgress, setRegisterInProgress] = useState(false)

  const worker = useWorker(createWorker)

  async function updateMirror () {
    const ano = props.date.getFullYear()
    const mes = String(props.date.getMonth() + 1).padStart(2, '0')

    const webWorkerEspelho = await worker.consultaPonto(ano, mes)
    props.onRegister(webWorkerEspelho)
    atualizaResumo()
    setRegisterInProgress(false)
  }

  function atualizaResumo () {
    if (props.mirror) {
      const date = new Date(props.date)
      const dateString = date?.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      console.log('batidas: ', props.mirror.dias[dateString])
      setMirrorDayInfo(props.mirror.dias[dateString])

      const dateMonthString = dateString.slice(0, -3)
      console.log('totais: ', props.mirror.meses[dateMonthString])
      setMirrorMonthInfo(props.mirror.meses[dateMonthString])

      setSelectDay(new Date(props.date.getTime()))
    }
  }

  useEffect(() => {
    if (props.date.getTime() !== selectDay?.getTime()) {
      atualizaResumo()
    }
  })

  const registrarPonto = (event) => {
    setRegisterInProgress(true)

    AhgoraService.baterPonto().then(
      (result) => {
        console.log('ponto batido!')
        updateMirror()
      },
      (error) => {
        console.log(error)
        setRegisterInProgress(false)
      }
    )
  }

  return (
    <div className='resumo'>
      <div className='clock'>
        <Clock />
      </div>
      <div className='registraPonto'>
        <button
          onClick={registrarPonto}
          className='btnRegister'
          disabled={registerInProgress}
        >
          Registrar
        </button>
      </div>

      <div className='espelho-batidas'>
        {mirrorDayInfo?.batidas.map(({ hora, tipo, motivo }) => (
          <p
            key={hora}
            className={`exibirHora batidainfo ${
              tipo === 'PREVISTA' ? 'previsto' : ''
            }`}
            title={motivo || tipo}
          >
            {hora}
          </p>
        ))}
      </div>
      <div>
        {mirrorDayInfo?.totais.map(({ descricao, valor }) => (
          <div className='ctnFlex' key={descricao}>
            <p className=''>{descricao}</p>
            <p className=''>{valor}</p>
          </div>
        ))}
      </div>
      <br />
      <div>
        {mirrorMonthInfo?.totais.map(({ descricao, valor }) => (
          <div className='ctnFlex' key={descricao}>
            <p className=''>
              {descricao.replace('Banco de horas acumulado', 'Acumulado')}
            </p>
            <p className=''>{valor}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Resume
