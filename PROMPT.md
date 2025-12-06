# PROMPT
本文档用于指导项目的开发要点
本文档也可以用作 LLM 的提示词

## 项目指南
这个项目使用 Vite + React + TypeScript
它没有使用 React Compiler
它没有使用 SWC
它不使用任何实验特性
它不使用 SSR (server-side rendered)
它不使用 React Server Components
它使用 ESLint 检查和格式化代码
它使用 Vitest 作为单元测试框架
它只使用经过考验且广泛使用的社区精选组件
    - `antd` 基于 Ant Design 设计规范实现的 高质量 React 组件库
    - `ahooks` 一套高质量可靠的 React Hooks 库
    - `react-router` 路由
    - `@ant-design/icons` 图标
    - `dayjs` 时间日期
    - `lodash` 工具库
    - `@directus/sdk` 后端接口

## 组件风格指南
它不使用 Tailwind CSS
它使用 React 组件的 style 参数 (类型为 CSSProperties)
它使用 React 组件的 className 参数配合 CSS Modules 文件
自定义组件需要有注释说明使用场景
自定义组件的每个属性都需要有注释

## 代码组织提示
编写 React 组件时，要注意区分 "Page" 和 "Component"
"Component" 是可复用、可组合、独立的用户界面构建块，
    - 统一放在 `components` 目录，
    - 一般用两个单词以 PascalCase 命名
"Page" 是顶层组件，代表应用的一个功能页面，与一个路由 URL 强相关，
    - 统一放在 `pages` 目录，
    - 一般以 `Page` 结尾来命名
自定义 Hooks 同样遵循以上原则：
    - 与 "Page" 强相关的 Hook，放在 `pages/hooks` 目录下
多文件组件，
    - 以组件名新建目录，目录下为该组件专用的 `.tsx`, `.module.css`, `.ts`, `.test.ts`，
    - 每个 Hook 是单独的 `.ts` 文件，以全小写 Kebab-Case 来命名
工具函数，
    - 统一放在 `utils` 目录，以全小写 Kebab-Case 来命名，
    - 每个工具是单独的 `.ts` 文件，必须包含 `.test.ts` 作为测试用例
不要对已有的目录结构作改动，新增文件时才需要遵循以上原则。

## 数据和状态
应用无需考虑优先本地数据存储和离线功能
应用的数据存储在 Directus 实例中，使用 Directus SDK (`@directus/sdk`) 对数据增删查改
React 组件只需要考虑自己内部的临时状态
页面状态必须反映在 URL 中

## 应用、导航、列表与表单
应用的主要组成部份，本质上可以归纳为三种：
    - 导航
    - 列表 (List)
    - 表单 (Form)
应用应该采用移动端优先的设计
    - 导航使用顶部导航栏目 (少数几个) + 导航宫格 (一级入口)
    - 用户点击顶部导航栏目，进入导航页提供导航宫格供用户浏览
通常的，列表页有一级入口；用户在列表页的一个项目上点击，进入表单页
导航和列表可以按需求随意设计，但表单通常与 Directus 的数据模型相关
Directus 数据模型的集合的字段，有对应的表单控件可用
Directus 数据模型的集合之间的实体关系，也有对应的表单控件来表达
    - M2O 类型的字段 (也叫 "多对一"、"Lookup"、"查找") 用 LookupSelect 控件
    - O2M 类型的字段 (也叫 "一对多"、"相关列表") 用 RelatedList 控件
    - Image 类型的字段 (本质上是 M2O 到 directus_files) 用 ImageUpload 控件
    - M2M 类型的字段 (本质上是 O2M 到 Junction Table 连接表) 用 RelatedList 控件
    - Files 类型 (多个图片/文件) 的字段 (本质上是 O2M 到连接表) 用 RelatedList 控件

## 用户、部门与成员
"用户 (User)" ，是可以登录应用的使用者。由 directus_users 这个系统集合实现。
"组织 (Organization)" ，是对用户的分类。
    - 有些场景下，它可以是 "客户 (Account)"。
    - 但在 Account 语意下，组织之间会发生交易，有上下游关系 (如 "供应商")
"成员 (Member)"，是用户和组织的对应关系；
    - 换句话说，Member 是 User 和 Organization 这个 M2M 关系的连接表
"部门 (Department)"，是每个组织的层级架构，
    - 部门会设置成一个自关联的 M2O 层级树结构
"部门成员 (Department_Member)" 是 Member 和 Department 这个 M2M 关系的连接表
    - "部门岗位 (Title)"一般设置在 Department_Member 中，如 "经理 (Manager)"

## 产品和订单
"产品 (Product)"，是交易物
"订单 (Order)"，是交易记录
"订单产品 (OrderItem)"，是 Product 和 Order 这个 M2M 关系的连接表
"品牌 (Brand)" 和 "品类 (Category)" 本质上是为了管理产品而出现的衍生实体
"售后" 和 "物流"，都是交易记录，通过 M2O 与订单关联
"仓库" 表示产品的存放
"产品" 下有 "SKU" (通过 O2M 关系)
"库存" 定义在 "仓库" 和 "SKU" 的连接表上
"价格" 定义在 "SKU" 上

## 产品和产品规格
"规格属性 (Spec_Def)" 是产品的子表，通过 M2O 与产品关联，例如 "颜色" "尺码"
"规格属性选择项 (Spec_Opt)" 是 Spec_Def 的子表，通过 M2O 与 Spec_Def 关联，例如 "黄色" "XXL"
"SKU" 是产品的子表，通过 M2O 与产品关联，具有 "成本" 和 "价格"
"Spec_Opt" 和 "SKU" 是 M2M 关系：每个 SKU 可以有多个规格，每个规格也可以用在多个 SKU 上
