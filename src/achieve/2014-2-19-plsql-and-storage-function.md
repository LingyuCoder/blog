---
layout: art
title: PL/SQL编写存储函数
subTitle: PL/SQL安装使用 + 简单的存储函数编写
desc: 在编写报表的时候经常会遇到数据结构不适合生成交叉报表或列式报表的情况，而生成报表的报表工具又没有强力到能够将数据转换成理想的格式。但公司的数据库是用Oracle，还是可以使用PL/SQL来对数据进行转换。这里介绍了PL/SQL安装使用以及简单的存储函数的编写
categories: [数据库技术]
tags: [oracle, 存储函数]
---
{% raw %}
##PL/SQL安装
---
[PL/SQL和Oracle920整合的压缩包](http://pan.baidu.com/s/1ntwisrB)
提取码：cgsf

下载后由"PL\_SQL\_DEV\_9 + Oracle920.rar"解压并安装

###安装Oracle920
1. 解压压缩包，建议将Oracle920文件夹放在D盘根目录下，否则需要修改其注册表文件中的路径
2. 运行注册表文件oracle\.reg
3. 在环境变量中添加bin文件夹路径，如放在D盘根目录下，则添加D:\\oracle920\\bin

###安装pl/sql
1. 解压压缩包
2. 运行plsqldev906.exe安装
3. 运行chinese.exe添加中文补丁

###注意事项
1. 若Oracle920路径不放在D盘根目录下，运行注册表文件oracle\.reg文件前，用文本编辑工具打开，将所有涉及路径的地方修改成Oracle920文件夹的路径
2. 请在32位机上安装，64位自行百度解决方法

###修改pl/sql登录时的服务器可选项
由于无锡、绥化的Oracle服务器IP地址出现变更，需要修改服务器地址

存放地址的文件为(Oracle920所在文件夹)/Oracle920/network/ADMIN/tnsnames.ora，使用文本编辑工具打开

可以看到其中有类似代码：
```
hiservice_197 =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.0.197)(PORT = 1521))
    )
    (CONNECT_DATA =
      (SID = hiservic)
    )
  )
```
其中```hiservice_197```即为PL/SQl选择服务器的服务器名。```HOST = 192.168.0.197```定义了IP地址，```PORT = 1521```定义了端口，```SID = hiservic```定义了连接的数据库，可以根据需要进行修改，或者按照同样的规则在文档最后进行添加

##PL/SQL使用
###一般CRUD操作
很简单，在菜单 文件->新建->SQL窗口 来创建新的SQL窗口，在窗口中敲入SQL语句，按F8执行

若要通过图形界面进行新增、修改、删除，请在SQL语句后增加```for update```代码，比如原语句为```select * from user_info```，则修改为```select * from user_info for update```。

在执行前，点击SQL框下的“小锁”开启增加、删除、修改权限，使用“小锁”旁边的“加号”和“减号”来新增删除数据，修改直接单击需要修改的数据格即可。

修改完成后点击一下旁边的“绿勾”确认，然后点击左上角主菜单下的“提交按钮”或按F10进行提交，否则事务不会提交，修改不会生效

###存储过程相关
在有友好插件的文本编辑工具中写完存储过程后，若要全部执行，可以直接复制到同上的SQL框

如需一个一个定义执行，可以在菜单 文件->新建->命令窗口 来创建命令行，然后通过复制代码的方式写入存储过程的结构和函数，最后一行加```/```来标志结束。在命令行中需要检测是否含有某结构或函数，可以使用```desc```进行查看，如检测某Object结构或Table结构是否存在，可以使用（xxxx为结构名）：
```sql
desc type xxxx
```
若要检测函数或表信息，则（xxxx为函数名或表名）：
```sql
desc xxxx
```
若需要检查编译错误，在菜单  文件->新建->程序窗口 来进行调试，比如存储函数，可以新建Function窗口，模板向导若已有代码，可以不必填写，点击确定后直接用已有代码进行覆盖即可。使用F8来编译，若编译错误，底下会显示编译错误的原因及产生错误的行数

若存储过程中有输出语句如```DBMS_OUTPUT.PUTLINE(xxxx)```则在SQL窗口中运行，运行完成后点击输出标签页查看输出

##一些存储函数实例
###定义元数据结构
一般使用存储函数都是为了将现有的数据库表中的不规则的数据整理，生成iReport比较容易生成报表的结构。所以首先需要定义报表中需要的每一条数据的样式：
```sql
CREATE OR REPLACE TYPE objectName AS OBJECT (
    property_name_1 varchar2(255),
    property_name_2 number
);
```
其中```objectName```为结构名，```property_name_x```为属性名

这样就定义了一个简单的有一个字符串属性，一个数字属性的元数据结构。
###定义临时表结构
由于一般情况下都需要存储函数输出一整张每行都是这个结构的表，所以需要定义通过这个元数据结构组织成的表结构：
```sql
create or replace type tableName table of objectName;
```
其中```tableName```为表结构的名称，```objectName```为这个表结构所使用元数据结构的名称
###定义存储函数
定义存储函数：
```sql
create or replace function functionName(param1 number, param2 number)
return tableName pipelined
as
v_row objectName;
--变量定义
begin
--函数体
return;
end;
```
其中```functionName```为存储函数的名称，```tableName```为存储函数返回表结构的名称，```objectName```为表结构使用的元数据结构的名称

需要注意变量定义部分，所有后面使用到的变量都需要在这里先行定义

这个函数中定义了两个参数```param1```和```param2```，若不需要使用参数，则第一行直接改为```create or replace function functionName```，函数名后不需要添加括号
###遍历数据库中表获取数据
在函数体中通过```for in```遍历已有的表：
```
for itemName in (
    --sql语句
) loop
    --对表每一行数据进行操作
end loop;
```
这里sql语句和平常的sql语句没有太大区别，唯一的区别是可以使用变量作为```where```中的判断条件的参数，如有两个number型变量startTime，endTime，可以直接使用语句```where fieldName < endTime and fieldName >= startTime```

###将单个结果输出到变量
有的时候只需要一个统计结果，通过sql的聚集函数来实现，若需要将其结果存入变量中，可以使用```into```来实现：
```sql
select count(someUtTableName.id) into v_number_type_var
from someUtTableName
where balabala
```
这样就将count的结果存入到名叫```v_number_type_var```的变量之中了，这个变量需要在前面先行定义

###将数据组织成表
若需要将数据组织成结构，添加到返回表中：
```sql
v_row := objectName('abc', 123);
pip row(v_row);
```
其中```objectName```为元数据结构，```v_row```为元数据结构的变量，这样就相当于往结果的表里增加了一行。括号里面可以使用变量，但类型必须与元数据结构定义严格一致。

###在函数中增加调试用的输出
在函数体中加入如下代码:
```sql
DBMS_OUTPUT.PUTLINE('test information');
```
即可在运行的时候产生输出，括号内可以使用变量。在SQL框的输出标签页查看输出结果

###注释
使用```--注释内容```来添加单行注释

使用```/*注释内容*/```来添加多行注释

###调用存储函数
已经写好的存储函数需要在sql中进行调用，在写入iReport之前可以先在pl/sql中测试一下，比如已有存储函数functionName，接受两个number参数，则：
```sql
select * from table(functionName(123, 456))
```
若无参数，直接```from table(functionName())```即可。将其当做一张表来看，可以使用```group by```、```order by```、```where```等。select也可以选择需要的字段或改名

{% endraw %}