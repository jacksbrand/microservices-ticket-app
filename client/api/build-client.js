import axios from 'axios'

const buildClient = ({
  req
}) => {
  if (typeof window === 'undefined') {
    //Server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
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