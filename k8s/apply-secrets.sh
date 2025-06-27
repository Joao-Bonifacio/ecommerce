#!/bin/bash
IP=$(kubectl get secret metallb-ip -n metallb-system -o jsonpath="{.data.ip}" | base64 -d)
export METALLB_IP="$IP"

envsubst < ./cluster/metallb-config.yaml | kubectl apply -f -

EMAIL=$(kubectl get secret letsencrypt-email-secret -n cert-manager -o jsonpath="{.data.email}" | base64 -d)
export LETSENCRYPT_EMAIL="$EMAIL"

envsubst < ./cluster/cluster-issuer.yaml | kubectl apply -f -
