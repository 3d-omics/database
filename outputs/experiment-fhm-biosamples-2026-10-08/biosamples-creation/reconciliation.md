# BioSamples create reconciliation

The first POST for H001aM returned HTTP 500 before an accession was recorded. Public and authenticated exact-name BioSamples searches both found zero matches immediately and again after more than 30 seconds. The pending marker was cleared for one controlled retry; no assigned accession was present in the creation ledger.

The POST for M001aM also returned HTTP 500. Public and authenticated exact-name searches found no match immediately or after a delay. The pending marker was cleared for one controlled retry. The first 200 H accessions remained in the ledger.

The first F001aB POST returned HTTP 500 before an accession was recorded.
Public and authenticated exact-name searches found zero matches twice soon
after the response and again after more than 30 seconds. No F accession was
present in the creation ledger. The pending marker was cleared for one
controlled retry.
