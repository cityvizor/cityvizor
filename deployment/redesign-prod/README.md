## Kubernetes config for landing page prod deployment


### Setup microk8s

```shell script
sudo snap install microk8s --channel=1.18/beta --classic
microk8s.start

sudo usermod -a -G microk8s ubuntu
sudo microk8s.enable dns helm ingress

alias kubectl='microk8s.kubectl'
alias helm='microk8s.helm'

helm init
```

### Setup TLS
https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm

```shell script
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.11/deploy/manifests/00-crds.yaml
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install --name cert-manager --version v0.11.0 --namespace cert-manager jetstack/cert-manager
```

### Run Helm
Checkout cityvizor, edit (copy) test_values.yml and apply

```shell script
cd deployment/redesign-prod/helm
helm install -f test_values.yml -n cityvizor ./cityvizor 
```

To upgrade
```shell script
helm upgrade -f test_values.yml cityvizor cityvizor/
```

### Automatic deployment
You can use Keel for automatic deployement. By default it watches tag specified in `values.yml` and deploys new versions.

```shell script
helm repo add keel-charts https://charts.keel.sh 
helm repo update

helm install --namespace=kube-system -n keel keel-charts/keel
```

### Create Postgres schema

```sql
CREATE USER cityvizor_test WITH PASSWORD 'cityv!zor_t3st';
create database cityvizor_test;
grant all privileges on database cityvizor_test to cityvizor_test;
```

Do not forgot to configure Postgres, so it is accessible from EC2
