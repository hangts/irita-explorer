import prodConfig from '../src/productionConfig';
export const ExplorerLang = {
    common:{
        allTxStatus:'All Status',
        success:'Success',
        failed:'Failed',
        allTxType:'All',
        selectDate:'Select Date',
        copied:'Copied',
        copyFailed:'Failed',
        all:'All',
        more:'Expand',
        fewer:'Collapse',
        //新增（时间）
        day1:'days',
        day:'day',
        hrs:'hrs',
        hr:'hr',
        mins:'mins',
        min:'min',
        secs:'secs',
        sec:'sec',
        ago:'ago',
        //新增可用状态
        true:'true',
        false:'false',
        //新增
        blocks:'blocks',
        s:'s',
        startDate:'Select Date',
        endDate:'Select Date',



    },
    table:{
        time: 'Time',
        validator:'Validator',
        operatorAddress:'Operator Address',
        selfBonded:'Self-Bonded',
        ownerAddress:'Owner Address',
        delegatorAddress: 'Delegator Address',
        withdrawAddress: 'Withdraw Address',
        respondserviceRequestId:'Request ID',
        author: 'Author',
        requestContentId:'Request Context ID',
        nftId:'NFT ID',
        denomId:'Denom ID',
        denomName:'Denom Name',
        recipient: 'Recipient',
        receiver: 'Receiver',
        feedName: 'Feed Name',
        serviceFeeCap: 'Service Fee Cap',
        digest:'Digest',
        digestAlgo:'Digest algo',
        minUnit: 'MinUnit',
        assetTokenId: 'Token ID',
        originalOwner: 'Original Owner',
        newOwner: 'New Owner',
        initialDeposit: 'Initial Deposit',
        depositor: 'Depositor',
        govOption: 'Option',
        clientID:'Client ID',
        portId: 'Port ID',
        channelId: 'Channel ID',
        connectionId: 'Connection ID',

        emptyDescription:'- No Data -',
        block: 'Block',
        transactions: 'Transactions',
        timestamp: 'Age',
        age: 'Age',
        txHash: 'TxHash',
        txType: 'MsgType',
        message:'Message',
        from: 'From',
        to: 'To',
        signer: 'Signer',
        txTimestamp: 'Age',
        // requestId: 'Request Id',
        requestId: 'Request Context ID',
        number:'#',
        name: 'Moniker',
        operator: 'Operator',
        votingPower: 'Voting Power',
        pubKey: 'PubKey',
        denom: 'Denom',
        owner: 'Owner',
        tokenName: 'NFT Name',
        tokenId: 'NFT ID',
        data: 'Data',
        uri: 'Uri',
        serviceName: 'Service Name',
        provider:'Provider',
        respondTimes:'Respond Times',
        isAvailable:'Is Available',
        price:'Cost Per Call',
        minBlock:'Minimum Response Time',
        bindTime:'Bind Time',
        disabledTime: 'Disabled Time',
        respondHash:'Respond Hash',
        consumer:'Consumer',
        requestHash:'Request Hash',
        requestStatus:'Request Status',
        deposit: 'Deposit',
        createHash:'TxHash',
        nftCount:'NFT',
        creator:'Creator',
        createTime:'Timestamp',
        identity:'ID',
        idPubkey:'Pubkey',
        pubKeyAlgo:'PubKey Algo',
        certificate:'Certificate',
        credentials: 'Credentials',
        updateTime:'Timestamp',
        // 新增
        commission: 'Commission',
        bondedTokens: 'Bonded Tokens',
        uptime: 'Uptime',
        delegators: 'Delegators',
        bondHeight: 'Bond Height',
        unbondingHeight: 'Unbonding Height', // 新增
        address: 'Address',
        amount: 'Amount',
        swapAmount1: 'Amount1',
        swapAmount2: 'Amount2',
        shares: 'Shares',
        endTime: 'End Time',
        fee: 'Fee',
        status: 'Status',
        consensusAddress: 'Consensus Address',
        proposerPriority: 'Proposer Priority',
        // 新增
        symbol: 'Symbol',
        totalSupply: 'TotalSupply',
        initialSupply: 'InitialSupply',
        maxSupply: 'MaxSupply',
        mintable: 'Mintable',
        token: 'Token',
        mintTo: 'MintTo',
        srcOwner:'SrcOwner',
        dstOwner: 'DstOwner',
        proposalId: 'ID',
        title: 'Title',
        type: 'Type',
        submitTime: 'Submit Time',
        depositEndTime: 'Deposit Endtime',
        votingEndTime: 'Voting Endtime',
        voter: 'Voter',
        voteOption: 'Vote Option',
        proposalType: 'Proposal Type',
        proposalID: 'Proposal ID',
        proposalTitle: 'Proposal Title',
        proposer: 'Proposer',
        submited: 'Submited',
        proposalStatus: 'Status',
        voted: 'voted',
        validators: 'Validators',
        sender: 'Sender',
        more: 'More',
        suffix: 'ago',
        running: 'Running',
        paused: 'Paused',
        completed: 'Completed',
        creatorName:'Creator'
    },
    unit:{
        ellipsis:' ,...',
        msgCountUnit:'',
        providers:'providers',
        time:'Time',
        blocks:'Blocks',
        totalRespond:'Total ${%value%} Responds',
        Txs:'Txs',
        // second:'Second',
    },
    message:{
        requestFailed: 'Failed to get data, please try again later',
        noTransaction: 'No Transaction'
    },
    Navigation:{
        block: 'Blockchain',
        transactions: 'Transactions',
        validators: 'Validators',
        nftAsset: 'NFT',
        denoms: 'Denom',
        service: 'iService',
        searchPlaceHolder: 'Search by Address / Txhash / Block',
        network:'Network'
    },
    home:{
        blockHeight: 'Block Height',
        transactions: 'Transactions',
        avgBlockTime: 'Avg Block Time',
        last100Blocs: 'Last 100 Blocks',
        validators: 'Consensus Nodes',
        services: 'iService',
        denoms:'Denom',
        assets: 'NFTs',
        identities: 'Idendity',
        blocks: 'Blocks',
        viewAll: 'View All',
        listTransactions: 'Transactions',
        tx:'TX#',
        txn: 'Txn',
        validatorNumCount: 'Validators',
        bondedTokens:'Bonded Tokens',
        votingPower: 'Voting Power',
    },
    block:{
        title:'Blockchain',
        currentHeight: 'Current Height',
    },
    blockDetail:{
        blockHash: 'Block Hash:',
        transaction: 'Transactions:',
        timestamp: 'Timestamp:',
        transactions: 'Transactions',
        // 新增
        proposer: 'Proposer:',
        validators: 'Validators:',
        votingPower: 'Voting Power:',
        inflation: 'Inflation:',
        validatorSet: 'Validator Set'
    },
    transactions:{
        title:'Transactions',
        txs: 'Txs',
        search: 'Search',
        status: ' Status',
        // 新增
        delegationTxsList: 'Delegation Txs List',
        validationTxsList: 'Validation Txs List',
        tooltip: 'Date selection range from the first block to the latest block.',
        govTxsList: 'Gov Txs List'
    },
    validators:{
        bonded:'Active',
        unbonding:'Candidate',
        unbonded:'Jailed',
    },
    nftAsset:{
        mainTitle:'NFT List',
        subTitle:'NFT',
        subTitles:'NFTs',
        search: 'Search',
        placeHolder: 'Search by NFT Id or NFT Name',
    },
    denom:{
        mainTitle:'Denom List',
        subTitle:'Denom',
        subTitles:'Denoms',
        search: 'Search',
        placeHolder: 'Search by Denom Name or Denom ID',
    },
    identityList:{
        title: 'Identity',
        search: 'Search',
        placeHolder: 'Search by ID / Owner',
    },
    identityDetail:{
        title: 'Identity Details',
        baseInfo: 'Base Info',
        credentialsInfo: 'Credentials Info',
        txRecord: 'Txs',
        owner: 'Owner',
        credentials: 'Credentials',
        createTxHash: 'Created TxHash',
        createHeight: 'Block',
        createTime: 'Timestamp',
    },
    service: {
        services: 'iService',
        from: 'From',
        description: 'Description',
        status: 'Status',
        placeHolder:'Search by iService Name or Description',
        serviceCount:' Services',
    },
    transactionInformation:{
        transactionInformation: 'Transaction Details',
        baseInfo:'Base Info',
        txHash: 'TxHash',
        blockHeight: 'Block',
        status: 'Status',
        timestamp: 'Timestamp',
        signer: 'Signer',
        memo: 'Memo',
        transactionMessageTitle: 'Messages',
        relevanceTx:'Related Transaction',
        txType: 'Type',
        denomId: 'Denom Id',
        denomName:'Denom Name',
        from: 'From',
        to: 'To',
        consumer: 'Consumer',
        provider: 'Provider',
        repeatedFrequency: 'Repeated Frequency',
        repeatedTotal: 'Repeated Total',
        serviceFeeCap: 'Service Fee Cap',
        timeOut: 'Timeout',
        serviceName: 'Service Name',
        requestContextId: 'Request Context ID', //更改，中文未变
        pricing: 'Pricing', //更改，中文未变
        owner: 'Owner',
        qos: 'QoS', // 更改，中文未变
        deposit: 'Deposit',
        nftId: 'NFT Id',
        nftName: 'NFT Name',
        data: 'Data',
        uri: 'Uri',
        fee: 'Fee',
        gasUsed:'Gas Used',
        issueDenom:{
            schema: 'Schema',
            sender: 'Sender',
        },
        send:{
            amount: 'Amount',
        },
        createRecord:{
            contents:'Contents',
        },
        callService: {
            input: 'Input',
            repeated: 'Repeated',
            superMode: 'SuperMode',
        },
        respondService:{
            output: 'Output',
            requestId: 'Request ID',
            result: 'Result',
        },
        defineService: {
            description: 'Description',
            tags: 'Tags',
            author: 'Author',
            authorDescription: 'Author Description',
            schemas:'Schemas',
        },
        identity:{
            id:'ID',
            pubkey:'Pubkey',
            certificate:'Certificate',
            credentials:'Credentials',
            pubKeyAlgo:'PubKey Algo'
        },
        recvPacket:{
            packet:'Packet',
            proof:'Proof',
            proofHeight:'Proof Height',
            proofPath:'Proof Path',
            proofData:'Proof Data',
            clientID:'Client ID',
            module:'Module',
            viewSource: 'View Source',
        },
        client:{
            clientID:'Client ID',
            header:'Header',
        },
        // 新增
        staking: {
            from: 'From :',
            amount:'Amount :',
            to:'To :',
            shares: 'Shares :',
            toShares: 'Shares : ',//'Shares : '此处有空格
            endTime: 'End Time :',
            withdrawAddress: 'Withdraw Address:',
            delegatorAddress: 'Delegator Address :',
            operatorAddress: 'Operator Address :',
            moniker: 'Moniker :',
            identity: 'Identity :',
            selfBonded: 'Self-Bonded :',
            ownerAddress:'Owner Address :',
            consensusPubkey: 'Consensus Pubkey :',
            commissionRate: 'Commission Rate :',
            website: 'Website :',
            details: 'Details :',
            depositor: 'Depositor :',
            validator: 'Validator : ',
            minSelfDelegation: 'Min Self Delegation :',
            securityContact: 'Security Contact :',
        },
        coinswap: {
            isBuyOrder: 'isBuyOrder :',
            inputAddress: 'Input Address :',
            Input: 'Input :',
            outputAddress: 'Output Address :',
            output: 'Output :',
            deadline: 'Deadline :',
            sender: 'Sender :',
            exactIrisAmt: 'Exact Standard Amt :',
            minIrisAmt: 'Min Standard Amt :',
            maxToken: 'Max Token :',
            minToken: 'Min Token :',
            minLiquidity: 'Min Liquidity :',
            withdrawLiquidity: 'Withdraw Liquidity :',
            amount: 'Amount :', // 新增
            tokenPair: 'Token Pair :', // 新增
        },
        oracle: {
            feedName: 'Feed Name',
            input: 'Input',
            description: 'Description',
            latestHistory: 'Latest History',
            creator: 'Creator',
            providers: 'Providers',
            aggregateFunc: 'Aggregate Func',
            valueJsonPath: 'Value Json Path',
            responseThreshold: 'Response Threshold',
        },
        random: {
            blockInterval: 'Block interval',
            oracle: 'Oracle',
        },
        // 新增
        asset: {
            symbol: 'Symbol',
            name: 'Name',
            decimal: 'Decimal',
            initialSupply: 'InitialSupply',
            maxSupply: 'MaxSupply',
            mintable: 'Mintable',
            owner: 'Owner',
            tokenId: 'TokenId',
            amount: 'Amount',
            to: 'To',
            originalOwner: 'Original Owner',
            newOwner: 'New Owner',
            minUnit: 'MinUnit',
            sender: 'Sender'
        },
        gov: {
            depositor: 'Depositor',
            proposalID: 'Proposal ID',
            deposit: 'Deposit',
            voter: 'Voter',
            option: 'Option',
            proposer: 'Proposer',
            title: 'Title',
            initialDeposit: 'Initial Deposit',
            description: 'Description',
            parameter: 'Parameter',
            name: 'Name',
            time: 'Upgrade Time',
            switchHeight: 'Switch Height',
            info: 'Info',
            recipient: 'Recipient',
            amount: 'Amount',
            upgradedClientState: 'Upgraded Client State',
        },
        bindService: {
            options: 'options',
        },
        ibc: {
            clientState: 'ClientState',
            consensusState: 'ConsensusState',
            clientID: 'ClientID',
            proofUpgradeClient: 'ProofUpgradeClient',
            proofUpgradeConsensusState: 'ProofUpgradeConsensusState',
            misbehaviour: 'Misbehaviour',
            counterparty: 'Counterparty',
            version: 'version',
            delayPeriod: 'delay period',
            previousConnectionId: 'PreviousConnectionId',
            counterpartyVersions: 'CounterpartyVersions',
            proofHeight: 'ProofHeight',
            proofInit: 'ProofInit',
            proofClient: 'ProofClient',
            proofConsensus: 'ProofConsensus',
            consensusHeight: 'ConsensusHeight',
            connectionId: 'ConnectionId',
            counterpartyConnectionId: 'CounterpartyConnectionId',
            proofTry: 'ProofTry',
            proofAck: 'ProofAck',
            portId: 'PortId',
            channel: 'Channel',
            previousChannelId: 'PreviousChannelId',
            counterpartyVersion: 'CounterpartyVersion',
            channelId: 'ChannelId',
            counterpartyChannelId: 'CounterpartyChannelId',
            packet: "Packet",
            proofUnreceived: 'ProofUnreceived',
            nextSequenceRecv: 'NextSequenceRecv',
            proofClose: 'ProofClose',
            acknowledgement: 'Acknowledgement',
            proofAcked: 'ProofAcked',
            proofCommitment: 'ProofCommitment',
            sourcePort: 'SourcePort',
            sourceChannel: 'SourceChannel',
            token: 'Amount',
            sender: 'Sender',
            receiver: 'Receiver',
            timeoutHeight: 'TimeoutHeight',
            timeoutTimestamp: 'TimeoutTimestamp',
            from:'Sender',
            to:'Receiver',
            amount: 'Amount',
            data:'Data'
        },
        multisend: {
            inputs: 'Inputs',
            outputs: 'Outputs'
        },
        htlc: {
            sender: 'Sender',
            to: 'To',
            receiverOnOtherChain: 'ReceiverOnOtherChain',
            senderOnOtherChain: 'SenderOnOtherChain',
            amount:'Amount',
            hashLock: 'HashLock',
            timestamp: 'Timestamp',
            timeLock: 'TimeLock',
            transfer: 'Mode',
            id: 'Id',
            secret: 'Secret',
            recipient: 'Recipient'
        }
    },
    addressDetail: {
        addressDetail:'Address Details',
        txRecord:'Txs',
        consumerTitle:'iService-As Consumer',
        providerTitle:'iService-As Provider',
        respondRecord:'Respond Record',
        assets: 'NFT',
        identities:'身份列表'
    },
    nftDetail: {
        nftInformation:'NFT Details',
        owner: 'Owner',
        denom: 'Denom',
        tokenName:'NFT Name',
        tokenId: 'NFT ID',
        schema: 'Schema',
        data: 'Data',
        creator: 'Creator',
        uri: 'Uri',
        nftTxs: 'Txs',
    },
    serviceDetail: {
        serviceDefinition: 'iService Details',
        primary: 'Base Info',
        author: 'Author',
        authorDescription: 'Author Description',
        description: 'Description',
        name: 'Name',
        schema: 'Schema',
        tags: 'Tags',
        serviceBindings: {
            serviceBindings: 'Service Binding',
            providers: 'Providers',
            deposit: 'Deposit',
            owner: 'Owner',
            pricing: 'Cost Per Call',
            qos: 'Minimum Response Time',
            bindTime: 'Bind Time',
            disabledTime: 'Disabled Time',
            hash:'Bind Details',
        },
        serviceTransactions: 'iService Transactions',
        hash:'Define Details',
        height:'Define Block',
        time:'Define Time',
        respondRecord:'iService Respond Record',
        provider:'Provider',
        txRecord:'Respond Record',
    },
    searchResult:{
        title: 'Search Results',
        backHome: 'Back Home',
        resultTitle: 'There is no valid result.',
        searchTip: 'Try to search with Address, Transaction, Block Number.',
    },
    // 新增
    // 验证人列表
    staking: {
        title: 'Validator List',
        status:{
            active:'Active',
            candidate:'Candidate',
            jailed:'Jailed',
        }
    },
    // 验证人详情
    validatorDetail: {
        title: 'Validator Details',
        validatorInformation: {
            validatorTip: 'The validator has no more information',
            operatorAddressTip: 'The address you used to Create a Validator , Delegate or Withdraw DelegatorReward, etc.',
            validationAssetInfoArr: {
                operatorAddress: 'Operator Address:',
                ownerAddress: 'Owner Address:',
                withdrawAddress: 'Withdraw Address:',
                votingPower: 'Voting Power:',
                uptime: 'Uptime:',
                missedBlocks: 'Missed Blocks:',
                bondHeight: 'Bond Height:',
                unbondingHeight:'Unbonding Height:',
                consensusPubkey: 'Consensus Pubkey:',
                jailedUntil:'Jailed Until:'
            }
        },
        commissionInfo: {
            title: 'Commission Info',
            scatter: {
                title: 'Commission Rate & Bonded Tokens Distribution',
                xAxis: 'Commission Rate (%)',
                yAxis: 'Bonded Token',
                tooltip: {
                    commissionRate: 'Commission Rate',
                    bondedTokens: 'Bonded Tokens',
                },
                otherValidator: 'Other Validator'
            },
            bondedAndCommissionArr: {
                commissionRate: 'Commission Rate:',
                bondedTokens: 'Bonded Tokens:',
                delegators: 'Delegators:',
                totalShares: 'Total Shares:',
                commissionRewards: 'Commission Rewards:',
                commissionRateRange: 'Commission Rate Range:',
                children: {
                    maxChangeRateEverytime: 'Max Change Rate Everytime:',
                    selfBonded: 'Self-Bonded:',
                    delegatorBonded:'Delegator Bonded:'
                }
            }
        },
        delegationsTitle: 'Delegations',
        unbondingDelegationsTitle: 'Unbonding Delegations',
        delegationsTxsTitle: 'Delegation Txs',
        validationTxsTitle: 'Validation Txs',
        depositedProposalsTitle: 'Deposited Proposals',
        votedProposalsTitle: 'Voted Proposals',
        govTxsTitle: 'Gov Txs',
    },
    // 普通地址详情
    addressInformation: {
        tab:{
            assetInfo:'Assets',
            nftCount:'NFT',
            identity:'Identity',
            iService:'iService',
            tx:'Txs',
        },
        content: {
            address: 'Address',
            token: 'Token',
            totalAmount: 'Total Amount',
            balance: 'Balance',
            delegated: 'Delegated',
            unBonding: 'UnBonding',
            rewards: 'Rewards'
        },
        delegatorRewards: {
            title: 'Delegator Rewards',
            withdrawTo: 'Withdraw To'
        },
        validatorRewards: {
            title: 'Validator Rewards',
            validatorMoniker: 'Validator Moniker',
            operatorAddress:'Operator Address'
        }
    },
    // 新增
    asset:{
        nativeAssetsList: 'Native Asset List',
        nativeAssetTxsList: 'Native Asset Txs List',
        issueTokenTxs: 'Issue Token Txs',
        editTokenTxs: 'Edit Token Txs',
        mintTokenTxs: 'Mint Token Txs',
        burnTokenTxs: 'Burn Token Txs',
        transferOwnerTxs: 'Transfer Owner Txs',
        details: 'Details',
        owner: 'Owner',
        totalSupply: 'Total Supply',
        initialSupply: 'Initial Supply',
        maxSupply: 'Max Supply',
        mintable: 'Mintable',
        name: 'Name',
        decimal: 'Decimal',
        minUnit: 'Min Unit'
    },
    stats:{
        richList: `Rich List`,
        stats: `Token Stats`,
        id:'#',
        address:'Address',
        amount:'Amount',
        percentage:'Percentage',
        title:`Top 100 Addresses by`,
        help:'The assets include the balance tokens，delegated tokens, unbonding tokens and remaining tokens on the address.',
        distribution:`Token Distribution`,
    },
    // 新增
    gov: {
        proposalsTitle: 'Proposal List',
        proposals: 'Proposals',
        proposalOption: {
            yes: 'Yes',
            abstain: 'Abstain',
            no: 'No',
            noWithVeto:'NoWithVeto'
        },
        proposalsType: {
            DepositPeriod: 'DepositPeriod',
            VotingPeriod: 'VotingPeriod'
        },
        CurrentDeposit: 'CurrentDeposit',
        InitialDeposit: 'InitialDeposit',
        MinDeposit: 'MinDeposit',
        proposalDetails: 'Proposal Details',
        govTallying: 'Gov Tallying',
        participation: 'Participation',
        passThreshold: 'Pass Threshold',
        vetoThreshold: 'Veto Threshold',
        proposalDetail: {
            proposer: 'Proposer',
            submitHash: 'Submit Hash',
            type: 'Type',
            recipient: 'Recipient',
            amount: 'Amount',
            description: 'Description',
            name: 'Name',
            switchHeight: 'Switch Height',
            info: 'Info',
            time: 'Upgrade Time',
            parameterDetails: 'Parameter Details',
            submitTime: 'Submit Time',
            depositEndTime: 'Deposit End Time',
            burned: 'Burned',
            votingStartTime: 'Voting Start Time',
            votingEndTime: 'Voting End Time',
            status: 'Status',
            participation: 'Participation',
            yes: 'Yes',
            no: 'No',
            noWithVeto: 'NoWithVeto',
            abstain: 'Abstain',
            viewAll: 'View All',
            totalDeposit: 'Total Deposit',
            burnedDeposit: 'Burned Deposit',
            initialDeposit: 'Initial Deposit',
            minDeposit: 'MinDeposit',
            upgradedClientState: 'Upgraded Client State',
        }
    }
}
