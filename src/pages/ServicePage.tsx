import { CardNav } from '@/components/CardNav'
import { Title } from '@/components/Title'
import { ApartmentOutlined, AppleOutlined, DeploymentUnitOutlined, FormOutlined, KeyOutlined, MedicineBoxOutlined, ProductOutlined, SafetyOutlined, TransactionOutlined, UserOutlined } from '@ant-design/icons'
import { Flex } from 'antd'

export function ServicePage() {
    return (
        <>
            <Title title="服务" />
            <Flex vertical gap="large">
                <CardNav title="账号相关">
                    <CardNav.Button icon={UserOutlined} text="我的信息" color="#1677FF" href="/user" />
                    <CardNav.Button icon={KeyOutlined} text="修改密码" color="#EB2F96" href="#" />
                    <CardNav.Button icon={SafetyOutlined} text="密码提示" color="red" href="#" />
                </CardNav>
                <CardNav title="生活服务">
                    <CardNav.Button icon={FormOutlined} text="撰写博客" color="forestgreen" href="/form/blog/+?status=draft" />
                    <CardNav.Button icon={AppleOutlined} text="品牌管理" color="midnightblue" href="/brand" />
                    <CardNav.Button icon={ApartmentOutlined} text="品类设置" color="blueviolet" href="/category" />
                    <CardNav.Button icon={ProductOutlined} text="添加产品" color="orangered" href="/form/product/+?status=draft" />
                    <CardNav.Button icon={TransactionOutlined} text="生活缴费" color="royalblue" href="#" />
                    <CardNav.Button icon={MedicineBoxOutlined} text="医疗健康" color="orange" href="#" />
                </CardNav>
                <CardNav title="工具箱">
                    <CardNav.Button icon={DeploymentUnitOutlined} text="生成页面" color="violet" href="/factory" />
                </CardNav>
            </Flex>
        </>
    )
}
