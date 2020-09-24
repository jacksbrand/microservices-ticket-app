import axios from 'axios'

const buildClient = ({
  req
}) => {
  if (typeof window === 'undefined') {
    //Server
    return axios.create({
      baseURL: 'http://www.firetix.xyz',
      // baseURL: 'http://ingress-nginx-controller-admission.kube-system.svc.cluster.local',
      headers: req.headers
    })
  } else {
    //Client
    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient