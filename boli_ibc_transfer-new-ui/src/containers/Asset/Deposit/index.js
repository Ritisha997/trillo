import { Button, Col, Form, Modal, Row } from 'antd';
import React, { useState } from 'react'
import CustomInput from '../../../components/CustomInput';
import { truncateString } from "../../../utils/string";
import '../index.scss';

const IBCDeposit = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState(0)

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            <div className="modal_container">
                <Button type='primary' className='btn-filled' onClick={showModal}>
                    IBC Deposit
                </Button>
                <Modal title="IBC Deposit"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    className="asstedeposit-modal"
                    centered={true}
                    closable={true}
                    footer={null}
                    width={480}
                >
                    <Form layout="vertical">
                        <Row>
                            <Col>
                                <Form.Item label="From">
                                    <CustomInput
                                        type="text"
                                        value={truncateString("comdexjhdbhbndjkcndscds", 9, 9)}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            {/* <SvgIcon name="arrow-right" viewbox="0 0 17.04 15.13" /> */}
                            <Col>
                                <Form.Item label="To" className='ml-1'>
                                    <CustomInput
                                        type="text"
                                        value={truncateString("comdexjhdbhbndjkcndscds", 9, 9)}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="position-relative">
                                <div className="availabe-balance">
                                    Available
                                    <span className="ml-1">
                                        123 BOLI
                                    </span>
                                    <span className="assets-maxhalf">
                                        <Button
                                            className=" active"
                                        >
                                            Max
                                        </Button>
                                    </span>
                                </div>
                                <Form.Item
                                    label="Amount to Deposit"
                                    className="assets-input-box"
                                >
                                    <CustomInput
                                        value={amount}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center mt-2">
                                <Button
                                    type="primary"
                                    className="btn-filled modal-btn"
                                >
                                    Deposit
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        </>
    )
}

export default IBCDeposit;